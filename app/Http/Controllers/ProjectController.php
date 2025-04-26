<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Different queries based on role
        $projects = match ($user->role) {
            'manager' => Project::with(['lead', 'salesPerson','approver'])->latest()->get(),
            'sales' => Project::where('sales_id', $user->id)
                        ->with(['lead', 'approver'])
                        ->latest()
                        ->get(),
            default => Project::where('sales_id', $user->id)->get(),
        };
        
        return Inertia::render('projects/index', [
            'projects' => $projects,
            'canApproveProjects' => $user->role === 'manager',
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create()
    {
        // Only get leads that aren't already converted
        $availableLeads = Lead::where('status', '!=', 'converted')->get();
        
        return Inertia::render('projects/create', [
            'availableLeads' => $availableLeads,
        ]);
    }

    /**
     * Store a newly created project in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:draft,pending_approval',
        ]);

        // Set the sales_id to the current user
        $validated['sales_id'] = Auth::id();
        
        // Create the project
        $project = Project::create($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project)
    {
        $project->load(['lead', 'salesPerson', 'approver', 'customers']);
        
        return Inertia::render('projects/show', [
            'project' => $project,
            'canApprove' => Auth::user()->role === 'manager' && $project->status === 'pending_approval',
        ]);
    }

    /**
     * Show the form for editing the specified project.
     */
    public function edit(Project $project)
    {
        // Prevent editing approved projects
        if ($project->status === 'approved') {
            return redirect()->route('projects.show', $project)
                ->with('error', 'Approved projects cannot be edited.');
        }
        
        // Only get leads that aren't already converted or the current project's lead
        $availableLeads = Lead::where(function ($query) use ($project) {
            $query->where('status', '!=', 'converted')
                  ->orWhere('id', $project->lead_id);
        })->get();
        
        return Inertia::render('projects/edit', [
            'project' => $project->load(['lead', 'salesPerson']),
            'availableLeads' => $availableLeads,
        ]);
    }

    /**
     * Update the specified project in storage.
     */
    public function update(Request $request, Project $project)
    {
        // Prevent updating approved projects
        if ($project->status === 'approved') {
            return redirect()->route('projects.show', $project)
                ->with('error', 'Approved projects cannot be updated.');
        }

        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:draft,pending_approval',
        ]);
        
        $project->update($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Approve the specified project.
     */
    public function approve(Project $project)
    {
        // Check if user is a manager
        if (Auth::user()->role !== 'manager') {
            return redirect()->route('projects.show', $project)
                ->with('error', 'Only managers can approve projects.');
        }
        
        // Check if project is pending approval
        if ($project->status !== 'pending_approval') {
            return redirect()->route('projects.show', $project)
                ->with('error', 'Only projects pending approval can be approved.');
        }
        
        // Begin transaction
        \DB::beginTransaction();
        
        try {
            // Update project status
            $project->update([
                'status' => 'approved',
                'approved_by' => Auth::id(),
                'approved_at' => now(),
            ]);
            
            // Update lead status to converted
            $lead = Lead::findOrFail($project->lead_id);
            $lead->update(['status' => 'converted']);
            
            // Create a new customer based on lead data
            Customer::create([
                'project_id' => $project->id,
                'name' => $lead->name,
                'address' => null, // You may want to add this field to leads
                'registration_date' => now(),
            ]);
            
            \DB::commit();
            
            return redirect()->route('projects.show', $project)
                ->with('success', 'Project approved successfully and customer created.');
        } catch (\Exception $e) {
            \DB::rollBack();
            
            return redirect()->route('projects.show', $project)
                ->with('error', 'An error occurred while approving the project: ' . $e->getMessage());
        }
    }

    /**
     * Reject the specified project.
     */
    public function reject(Project $project)
    {
        // Check if user is a manager
        if (Auth::user()->role !== 'manager') {
            return redirect()->route('projects.show', $project)
                ->with('error', 'Only managers can reject projects.');
        }
        
        // Update project status
        $project->update([
            'status' => 'rejected',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);
        
        return redirect()->route('projects.show', $project)
            ->with('success', 'Project rejected.');
    }
}