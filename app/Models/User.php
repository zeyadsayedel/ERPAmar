<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_login',
        'user_nicename',
        'user_url',
        'display_name',
        'first_name',
        'last_name',
        'nickname',
        'description',
        'rich_editing',
        'syntax_highlighting',
        'comment_shortcuts',
        'admin_color',
        'use_ssl',
        'show_admin_bar_front',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'user_activation_key',
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
            'rich_editing' => 'boolean',
            'syntax_highlighting' => 'boolean',
            'comment_shortcuts' => 'boolean',
            'use_ssl' => 'boolean',
            'show_admin_bar_front' => 'boolean',
            'show_welcome_panel' => 'boolean',
        ];
    }

    /**
     * Check if user has a WordPress capability by using Spatie permissions
     * 
     * @param string|array $capability WordPress capability name
     * @return bool
     */
    public function hasCapability($capability)
    {
        return $this->hasPermissionTo($capability);
    }

    /**
     * Assign WordPress capability to user
     * 
     * @param string|array $capability WordPress capability name 
     * @return $this
     */
    public function assignCapability($capability)
    {
        return $this->givePermissionTo($capability);
    }

    /**
     * Map WordPress role to user
     * 
     * @param string $role Role name (administrator, editor, etc)
     * @return $this
     */
    public function assignWordPressRole($role)
    {
        return $this->assignRole($role);
    }

    /**
     * Check if user has the WordPress role
     *
     * @param string $role Role name (administrator, editor, etc)
     * @return bool
     */
    public function hasWordPressRole($role)
    {
        return $this->hasRole($role);
    }
}
