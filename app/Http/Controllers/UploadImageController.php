<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class UploadImageController extends Controller
{
    //
    public function upload(Request $req){
        $image = $req->profile;
        $id = $req->id;
        $oldImageAddress = $req->oldImageAddress;
        $name = "user_".$id."_".$image->getClientOriginalName();
       $data = DB::table('users')->updateOrInsert(['id'=>$id],['image_address'=>$name]);
        $res = $image->storeAs('public/images',$name);
        if( !($oldImageAddress=='0_default_female_profile_image.png'
            ||$oldImageAddress=='0_default_male_profile_image.png'
            ||$oldImageAddress=='default.png'))
        { 
                 Storage::delete('/public/images/'.$oldImageAddress);
        }
        return $res;
    }
}
