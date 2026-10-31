<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Http\Controllers\UserController;

class UploadImageController extends Controller
{
    /**
     * Upload and synchronize profile photo for authenticated users and clinicians.
     */
    public function upload(Request $req) {
        // Resolve target user ID with robust session/auth fallback
        $id = $req->input('id');
        if (!$id) {
            list($authId, $role) = UserController::getAuthUser($req);
            $id = $authId ?: session('loggedInUser');
        }

        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'User identity could not be verified. Please log in again.'
            ], 401);
        }

        // Validate uploaded image payload
        if (!$req->hasFile('profile') || !$req->file('profile')->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'No valid image file uploaded. Please select a PNG, JPG or WebP image.'
            ], 422);
        }

        $image = $req->file('profile');
        $ext = strtolower($image->getClientOriginalExtension() ?: 'png');
        if (!in_array($ext, ['png', 'jpg', 'jpeg', 'webp', 'gif'])) {
            $ext = 'png';
        }

        // Clean, collision-free, URL-safe filename with timestamp cache-buster
        $name = "user_{$id}_" . time() . '.' . $ext;

        // 1. Store in standard Laravel public storage
        $res = $image->storeAs('public/images', $name);

        // 2. Mirror file to both public/storage/images and public/images for cross-platform static server compatibility
        $publicStorageDir = public_path('storage/images');
        $publicImagesDir = public_path('images');

        if (!file_exists($publicStorageDir)) {
            @mkdir($publicStorageDir, 0777, true);
        }
        if (!file_exists($publicImagesDir)) {
            @mkdir($publicImagesDir, 0777, true);
        }

        $storedAbsolutePath = storage_path('app/public/images/' . $name);
        if (file_exists($storedAbsolutePath)) {
            @copy($storedAbsolutePath, $publicStorageDir . DIRECTORY_SEPARATOR . $name);
            @copy($storedAbsolutePath, $publicImagesDir . DIRECTORY_SEPARATOR . $name);
        }

        // 3. Clean up old non-default image files
        $defaultImages = [
            '0_default_female_profile_image.png',
            '0_default_male_profile_image.png',
            'default.png',
            'user_4_avatar.png',
            'lazyeye-icon.svg'
        ];

        $oldImageAddress = $req->input('oldImageAddress');
        if (!$oldImageAddress) {
            $currentUser = DB::table('users')->where('id', $id)->first();
            $oldImageAddress = $currentUser ? $currentUser->image_address : null;
        }

        if ($oldImageAddress && !in_array($oldImageAddress, $defaultImages)) {
            try {
                Storage::delete('/public/images/' . $oldImageAddress);
                if (file_exists($publicStorageDir . DIRECTORY_SEPARATOR . $oldImageAddress)) {
                    @unlink($publicStorageDir . DIRECTORY_SEPARATOR . $oldImageAddress);
                }
                if (file_exists($publicImagesDir . DIRECTORY_SEPARATOR . $oldImageAddress)) {
                    @unlink($publicImagesDir . DIRECTORY_SEPARATOR . $oldImageAddress);
                }
            } catch (\Throwable $e) {}
        }

        // 4. Update user record in database
        DB::table('users')->where('id', $id)->update(['image_address' => $name]);

        $imageUrl = '/storage/images/' . $name . '?v=' . time();

        return response()->json([
            'success' => true,
            'image_address' => $name,
            'image_url' => $imageUrl,
            'message' => 'Profile photo updated successfully!'
        ]);
    }
}
