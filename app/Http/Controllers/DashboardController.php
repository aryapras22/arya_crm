<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with key metrics.
     */
    public function index()
    {
        $user = Auth::user();
        $isManager = $user->role === 'manager';
        $userId = $user->id;
        
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        
        if ($isManager) {
            $metrics = [
                'totalLeads' => [
                    'current' => Lead::count(),
                ],
                'totalProjects' => [
                    'current' => Project::count(),
                ],
                'approvedProjects' => [
                    'current' => Project::where('status', 'approved')->count(),
                ],
            ];
            
            $recentLeads = Lead::with('creator')
                          ->latest()
                          ->limit(5)
                          ->get();
                          
            $recentProjects = Project::with(['lead', 'salesPerson'])
                             ->latest()
                             ->limit(5)
                             ->get();
        } else {
            // Sales metrics
            $metrics = [
                'myLeads' => [
                    'current' => Lead::where('created_by', $userId)->count(),
                ],
                'myProjects' => [
                    'current' => Project::where('sales_id', $userId)->count(),
                ],
                'approvedProjects' => [
                    'current' => Project::where('sales_id', $userId)
                                ->where('status', 'approved')
                                ->count(),
                ],
                'pendingProjects' => [
                    'current' => Project::where('sales_id', $userId)
                                ->where('status', 'pending_approval')
                                ->count(),
                ],
            ];
            
            $recentLeads = Lead::where('created_by', $userId)
                          ->latest()
                          ->limit(5)
                          ->get();
                          
            $recentProjects = Project::where('sales_id', $userId)
                             ->with('lead')
                             ->latest()
                             ->limit(5)
                             ->get();
        }
        
        return Inertia::render('dashboard', [
            'metrics' => $metrics,
            'recentLeads' => $recentLeads,
            'recentProjects' => $recentProjects,
        ]);
    }
}