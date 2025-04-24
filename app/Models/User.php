<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string'
        ];
    }
        /**
     * Get the leads created by this user.
     */
    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'created_by');
    }

    /**
     * Get the projects this user is responsible for as a sales person.
     */
    public function salesProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'sales_id');
    }

    /**
     * Get the projects approved by this user.
     */
    public function approvedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'approved_by');
    }
}
