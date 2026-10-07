import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import {NavLink} from 'react-router-dom';

export default class ImageUploadModal extends React.Component{
    constructor(props) {
        super(props);
        }
    render(){
        return(
        <>
          
<div className="modal fade" id="uploadImageModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
            <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                <h5 className="modal-title fw-bold text-main" id="staticBackdropLabel">
                    <i className="fa-solid fa-camera text-primary me-2"></i>Upload Profile Photo
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
                <form name='imageUpload' encType='multipart/form-data'>
                    <input type={'text'} name="id" defaultValue={this.props.data.id || ''} hidden />
                    <input type={'text'} name="oldImageAddress" defaultValue={this.props.data.image_address || ''} hidden />
                    <div className="mb-3">
                        <label className="form-label small fw-semibold text-sub">Select Image File</label>
                        <input type={'file'} name="profile" className='form-control' accept="image/*" required />
                        <small className="text-muted d-block mt-1">Recommended: Square PNG, JPG or WebP (max 2MB)</small>
                    </div>
                    <button type="submit" className='btn btn-primary w-100 fw-semibold rounded-pill py-2 shadow-sm'>
                        <i className="fa-solid fa-cloud-arrow-up me-1"></i> Upload Photo
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
                            </>
      )
  }
}

