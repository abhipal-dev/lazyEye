import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";

export default class ImageUploadModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewUrl: null,
            uploading: false,
            errorMsg: ''
        };
        this.fileInputRef = React.createRef();
    }

    handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            this.setState({ previewUrl: null, errorMsg: '' });
            return;
        }

        // Validate 5MB max
        if (file.size > 5 * 1024 * 1024) {
            this.setState({
                errorMsg: 'File is too large. Please select an image under 5MB.',
                previewUrl: null
            });
            if (this.fileInputRef.current) this.fileInputRef.current.value = '';
            return;
        }

        const preview = URL.createObjectURL(file);
        this.setState({ previewUrl: preview, errorMsg: '' });
    };

    handleModalClose = () => {
        if (this.state.previewUrl) {
            URL.revokeObjectURL(this.state.previewUrl);
        }
        this.setState({ previewUrl: null, uploading: false, errorMsg: '' });
        if (this.fileInputRef.current) this.fileInputRef.current.value = '';
    };

    render() {
        const userId = this.props.data?.id || 
            (document.querySelector("section#user")?.dataset?.id) || 
            (document.querySelector("section#admin")?.dataset?.id) || '';
        const oldImage = this.props.data?.image_address || '';

        return (
            <div className="modal fade" id="uploadImageModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '16px' }}>
                        <div className="modal-header border-bottom py-3" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="d-flex align-items-center gap-2">
                                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, backgroundColor: 'rgba(59, 130, 246, 0.12)', color: 'var(--primary-color, #2563eb)' }}>
                                    <i className="fa-solid fa-camera"></i>
                                </div>
                                <div>
                                    <h5 className="modal-title fw-bold text-main mb-0" id="staticBackdropLabel" style={{ fontSize: '1.1rem' }}>
                                        Upload Profile Photo
                                    </h5>
                                    <small className="text-muted">Update your clinical account avatar</small>
                                </div>
                            </div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.handleModalClose}></button>
                        </div>
                        <div className="modal-body p-4">
                            <form name='imageUpload' encType='multipart/form-data'>
                                <input type='hidden' name="id" value={userId} readOnly />
                                <input type='hidden' name="oldImageAddress" value={oldImage} readOnly />

                                {/* Avatar Preview Area */}
                                <div className="d-flex flex-column align-items-center justify-content-center mb-4">
                                    <div 
                                        className="rounded-circle border position-relative overflow-hidden shadow-sm d-flex align-items-center justify-content-center mb-2" 
                                        style={{ 
                                            width: 104, 
                                            height: 104, 
                                            backgroundColor: 'var(--bg-surface-secondary)', 
                                            borderColor: 'var(--border-color)',
                                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)'
                                        }}
                                    >
                                        {this.state.previewUrl ? (
                                            <img 
                                                src={this.state.previewUrl} 
                                                alt="Preview" 
                                                className="w-100 h-100" 
                                                style={{ objectFit: 'cover' }} 
                                            />
                                        ) : oldImage && !oldImage.includes('default') ? (
                                            <img 
                                                src={`/storage/images/${oldImage}`} 
                                                alt="Current Avatar" 
                                                className="w-100 h-100" 
                                                style={{ objectFit: 'cover' }}
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <i className="fa-solid fa-user fa-3x text-muted" style={{ opacity: 0.5 }}></i>
                                        )}
                                    </div>
                                    <span className="small text-muted font-mono" style={{ fontSize: '0.78rem' }}>
                                        {this.state.previewUrl ? 'New Photo Preview' : 'Current Avatar'}
                                    </span>
                                </div>

                                {this.state.errorMsg && (
                                    <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
                                        <i className="fa-solid fa-circle-exclamation"></i>
                                        <span>{this.state.errorMsg}</span>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="form-label small fw-semibold text-main mb-1">Select Image File</label>
                                    <input 
                                        type='file' 
                                        name="profile" 
                                        ref={this.fileInputRef}
                                        className='form-control form-control-sm' 
                                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                                        onChange={this.handleFileChange}
                                        required 
                                        style={{ backgroundColor: 'var(--bg-surface-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                                    />
                                    <div className="d-flex align-items-center justify-content-between mt-1 text-muted" style={{ fontSize: '0.75rem' }}>
                                        <span>Formats: PNG, JPG, WebP</span>
                                        <span>Max size: 5 MB</span>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary flex-grow-1 fw-semibold py-2 rounded-pill" 
                                        data-bs-dismiss="modal"
                                        onClick={this.handleModalClose}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className='btn btn-primary flex-grow-1 fw-semibold py-2 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2'
                                        id="uploadImageSubmitBtn"
                                    >
                                        <i className="fa-solid fa-cloud-arrow-up"></i>
                                        <span>Save & Update</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
