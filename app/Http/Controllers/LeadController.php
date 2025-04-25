<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeadController extends Controller
{
    /**
     * Display a listing of the leads.
     */
    public function index()
    {
        $leads = Lead::with('creator')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('leads/index', [
            'leads' => $leads
        ]);
    }

    /**
     * Show the form for creating a new lead.
     */
    public function create()
    {
        return Inertia::render('leads/create');
    }

    /**
     * Store a newly created lead in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|in:new,contacted,qualified,lost',
        ]);

        $lead = Lead::create([
            ...$validated,
            'created_by' => Auth::id(),
        ]);

        return redirect()->route('leads.index')
            ->with('message', 'Lead created successfully');
    }

    /**
     * Display the specified lead.
     */
    public function show(Lead $lead)
    {
        $lead->load(['creator', 'projects']);

        return Inertia::render('leads/show', [
            'lead' => $lead
        ]);
    }

    /**
     * Show the form for editing the specified lead.
     */
    public function edit(Lead $lead)
    {
        return Inertia::render('leads/edit', [
            'lead' => $lead
        ]);
    }

    /**
     * Update the specified lead in storage.
     */
    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|string|in:new,contacted,qualified,lost,converted',
        ]);

        $lead->update($validated);

        return redirect()->route('leads.show', $lead)
            ->with('message', 'Lead updated successfully');
    }

    /**
     * Remove the specified lead from storage.
     */
    public function destroy(Lead $lead)
    {
        // Check if lead has associated projects
        if ($lead->projects()->exists()) {
            return redirect()->back()
                ->with('error', 'Cannot delete lead with associated projects');
        }

        $lead->delete();

        return redirect()->route('leads.index')
            ->with('message', 'Lead deleted successfully');
    }
}