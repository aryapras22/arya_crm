<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerService;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of all customers.
     */
    public function index()
    {
        $customers = Customer::with(['project', 'services.product'])
                     ->latest('registration_date')
                     ->get();
        
        return Inertia::render('customers/index', [
            'customers' => $customers
        ]);
    }

    /**
     * Display the specified customer details.
     */
    public function show(Customer $customer)
    {
        $customer->load(['project', 'services.product']);
        
        return Inertia::render('customers/show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Show the form for editing the specified customer.
     */
    public function edit(Customer $customer)
    {
        $customer->load(['project', 'services.product']);
        $products = Product::where('is_active', true)->get();
        $customerProductIds = $customer->services->pluck('product_id')->toArray();
        
        return Inertia::render('customers/edit', [
            'customer' => $customer,
            'availableProducts' => $products,
            'customerProductIds' => $customerProductIds,
        ]);
    }

    /**
     * Update the specified customer resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2',
            'address' => 'nullable|string',
            'status' => 'required|string|in:active,inactive,suspended,cancelled',
            'services' => 'sometimes|array',
            'services.*.product_id' => 'required|exists:products,id',
            'services.*.start_date' => 'required|date',
            'services.*.end_date' => 'nullable|date|after:services.*.start_date',
        ]);

        DB::beginTransaction();
        
        try {
            // Update basic customer data
            $customer->update([
                'name' => $validated['name'],
                'address' => $validated['address'],
                'status' => $validated['status'],
            ]);
            
            // Handle services if provided
            if (isset($validated['services'])) {
                $currentServiceIds = $customer->services->pluck('id')->toArray();
                $submittedServiceIds = [];
                
                // Process each service from the request
                foreach ($validated['services'] as $serviceData) {
                    // If service has an ID, it's existing and should be updated
                    if (isset($serviceData['id'])) {
                        CustomerService::where('id', $serviceData['id'])
                            ->where('customer_id', $customer->id)
                            ->update([
                                'product_id' => $serviceData['product_id'],
                                'start_date' => Carbon::parse($serviceData['start_date']),
                                'end_date' => isset($serviceData['end_date']) ? Carbon::parse($serviceData['end_date']) : null,
                            ]);
                        
                        $submittedServiceIds[] = $serviceData['id'];
                    } else {
                        // It's a new service to create
                        $newService = CustomerService::create([
                            'customer_id' => $customer->id,
                            'product_id' => $serviceData['product_id'],
                            'start_date' => Carbon::parse($serviceData['start_date']),
                            'end_date' => isset($serviceData['end_date']) ? Carbon::parse($serviceData['end_date']) : null,
                        ]);
                        
                        $submittedServiceIds[] = $newService->id;
                    }
                }
                
                // Delete services that were removed in the form
                $servicesToDelete = array_diff($currentServiceIds, $submittedServiceIds);
                if (!empty($servicesToDelete)) {
                    CustomerService::whereIn('id', $servicesToDelete)
                        ->where('customer_id', $customer->id)
                        ->delete();
                }
            }
            
            DB::commit();
            
            return redirect()->route('customers.show', $customer)
                ->with('success', 'Customer updated successfully');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update customer: ' . $e->getMessage());
        }
    }

    /**
     * Update the customer status.
     */
    public function updateStatus(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:active,inactive,suspended,cancelled',
        ]);
        
        $customer->update([
            'status' => $validated['status']
        ]);
        
        return redirect()->back()
            ->with('success', 'Customer status updated successfully');
    }

    /**
     * Add a product service to a customer.
     */
    public function addService(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);
        
        $customer->services()->create([
            'product_id' => $validated['product_id'],
            'start_date' => Carbon::parse($validated['start_date']),
            'end_date' => isset($validated['end_date']) ? Carbon::parse($validated['end_date']) : null,
        ]);
        
        return redirect()->back()
            ->with('success', 'Service added successfully');
    }
    
    /**
     * Remove a service from a customer.
     */
    public function removeService(Customer $customer, CustomerService $service)
    {
        // Make sure the service belongs to this customer
        if ($service->customer_id !== $customer->id) {
            return redirect()->back()
                ->with('error', 'This service does not belong to the customer');
        }
        
        $service->delete();
        
        return redirect()->back()
            ->with('success', 'Service removed successfully');
    }
}