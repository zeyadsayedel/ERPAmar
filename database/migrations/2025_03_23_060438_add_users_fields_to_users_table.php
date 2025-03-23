<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add WordPress-compatible fields
            $table->string('first_name')->nullable()->after('email');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('nickname')->nullable()->after('last_name');
            $table->string('user_login')->nullable()->after('nickname');
            $table->string('user_nicename')->nullable()->after('user_login');
            $table->string('user_url')->nullable()->after('user_nicename');
            $table->string('display_name')->nullable()->after('user_url');
            $table->text('description')->nullable()->after('display_name');
            
            // WordPress UI preferences (as mentioned in your User model)
            $table->boolean('rich_editing')->default(true)->after('description');
            $table->boolean('syntax_highlighting')->default(true)->after('rich_editing');
            $table->boolean('comment_shortcuts')->default(false)->after('syntax_highlighting');
            $table->string('admin_color')->default('fresh')->after('comment_shortcuts');
            $table->boolean('use_ssl')->default(false)->after('admin_color');
            $table->boolean('show_admin_bar_front')->default(true)->after('use_ssl');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the added columns
            $table->dropColumn([
                'first_name',
                'last_name',
                'nickname',
                'user_login',
                'user_nicename',
                'user_url',
                'display_name',
                'description',
                'rich_editing',
                'syntax_highlighting',
                'comment_shortcuts',
                'admin_color',
                'use_ssl',
                'show_admin_bar_front',
            ]);
        });
    }
};