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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // Laravel standard fields
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            
            // WordPress core user fields
            $table->string('user_login', 60)->unique()->nullable();
            $table->string('user_nicename', 50)->nullable()->index();
            $table->string('user_url', 100)->default('')->nullable();
            $table->string('display_name', 250)->default('')->nullable();
            $table->integer('user_status')->default(0)->nullable();
            $table->string('user_activation_key', 255)->default('')->nullable();
            
            // Common WordPress user_meta fields
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('nickname')->nullable();
            $table->text('description')->nullable();
            $table->boolean('rich_editing')->default(true)->nullable();
            $table->boolean('syntax_highlighting')->default(true)->nullable();
            $table->boolean('comment_shortcuts')->default(false)->nullable();
            $table->string('admin_color', 50)->default('fresh')->nullable();
            $table->boolean('use_ssl')->default(false)->nullable();
            $table->boolean('show_admin_bar_front')->default(true)->nullable();
            $table->text('dismissed_wp_pointers')->nullable();
            $table->boolean('show_welcome_panel')->default(true)->nullable();
            
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
