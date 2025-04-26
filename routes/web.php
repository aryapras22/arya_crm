<?php

use App\Http\Controllers\LeadController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
  // Lead CRUD routes
  Route::get('leads', [LeadController::class, 'index'])->name('leads.index');
  Route::get('leads/create', [LeadController::class, 'create'])->name('leads.create');
  Route::post('leads', [LeadController::class, 'store'])->name('leads.store');
  Route::get('leads/{lead}', [LeadController::class, 'show'])->name('leads.show');
  Route::get('leads/{lead}/edit', [LeadController::class, 'edit'])->name('leads.edit');
  Route::put('leads/{lead}', [LeadController::class, 'update'])->name('leads.update');
  Route::delete('leads/{lead}', [LeadController::class, 'destroy'])->name('leads.destroy');


   // Product CRUD routes
   Route::get('products', [ProductController::class, 'index'])->name('products.index');
   Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
   Route::post('products', [ProductController::class, 'store'])->name('products.store');
   Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
   Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
   Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
   Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');


    // Project CRU routes
    Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::get('projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::put('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    
    // Project approval routes
    Route::post('projects/{project}/approve', [ProjectController::class, 'approve'])->name('projects.approve');
    Route::post('projects/{project}/reject', [ProjectController::class, 'reject'])->name('projects.reject');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
