'use client';
import React, { useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import IconArrowLeft from '@/components/icon/icon-arrow-left';
import IconX from '@/components/icon/icon-x';

interface HeroSliderFormData {
    title: string;
    subtitle: string;
    mediaType: 'image' | 'video';
    buttonText?: string;
    buttonLink?: string;
    status: 'active' | 'inactive';
    order: number;
}

interface FormErrors {
    title?: string;
    subtitle?: string;
    mediaType?: string;
    buttonText?: string;
    buttonLink?: string;
    status?: string;
    order?: string;
}

const ComponentsAppsHeroSliderCreate = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [images, setImages] = useState<any>([]);
    const [mobileImages, setMobileImages] = useState<any>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState<HeroSliderFormData>({
        title: '',
        subtitle: '',
        mediaType: 'image',
        buttonText: '',
        buttonLink: '',
        status: 'active',
        order: 1,
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const onImageChange = (imageList: ImageListType) => {
        setImages(imageList as never[]);
    };

    const onMobileImageChange = (imageList: ImageListType) => {
        setMobileImages(imageList as never[]);
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
        }));

        // Clear error when user starts typing
        if (errors[name as keyof HeroSliderFormData]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Required field validations
        if (!formData.title || !formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.subtitle || !formData.subtitle.trim()) {
            newErrors.subtitle = 'Subtitle is required';
        }

        // Media validation
        if (formData.mediaType === 'image' && images.length === 0) {
            newErrors.mediaType = 'Please select a desktop image';
        }

        if (formData.mediaType === 'video' && !videoFile) {
            newErrors.mediaType = 'Please select a video file';
        }

        // Order validation
        if (formData.order < 1) {
            newErrors.order = 'Order must be at least 1';
        }

        // Button link validation
        if (formData.buttonLink && formData.buttonLink.trim()) {
            const link = formData.buttonLink.trim();
            // Allow absolute URLs (http/https) or relative paths (like index.html, /path, etc.)
            const isValidUrl = link.match(/^https?:\/\/.+/) || link.match(/^\/|^[^\s]+\.[^\s]+|^[^\s]+$/);
            if (!isValidUrl) {
                newErrors.buttonLink = 'Button link must be a valid URL (starting with http:// or https://) or a relative path (like index.html)';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!session?.accessToken) {
            alert('You must be logged in to create a hero slider');
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(25);

        try {
            // Prepare FormData for multipart upload
            const formDataToSend = new FormData();

            // Add text fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('subtitle', formData.subtitle);
            formDataToSend.append('mediaType', formData.mediaType);
            formDataToSend.append('buttonText', formData.buttonText || '');
            formDataToSend.append('buttonLink', formData.buttonLink || '');
            formDataToSend.append('status', formData.status);
            formDataToSend.append('order', formData.order.toString());

            // Add media files
            if (formData.mediaType === 'image') {
                if (images.length > 0) {
                    formDataToSend.append('desktopImage', images[0].file);
                }
                if (mobileImages.length > 0) {
                    formDataToSend.append('mobileImage', mobileImages[0].file);
                }
                setUploadProgress(75);
            } else if (formData.mediaType === 'video' && videoFile) {
                formDataToSend.append('videoFile', videoFile);
                setUploadProgress(75);
            } else {
                setUploadProgress(50);
            }

            // Create hero slider - use appropriate endpoint based on media type
            const endpoint = formData.mediaType === 'video' ? `${process.env.NEXT_PUBLIC_BACKENDURL}/api/hero-sliders/video` : `${process.env.NEXT_PUBLIC_BACKENDURL}/api/hero-sliders/image`;

            const headers: Record<string, string> = {
                Authorization: `Bearer ${session.accessToken}`,
            };

            // Use FormData for both video and image endpoints (multipart/form-data)
            const body = formDataToSend;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body,
            });

            setUploadProgress(100);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to create hero slider');
            }

            const result = await response.json();
            alert('Hero slider created successfully!');
            router.push('/apps/hero-slider');
        } catch (error) {
            console.error('Error creating hero slider:', error);
            alert(`Failed to create hero slider: ${error instanceof Error ? error.message : 'Please try again.'}`);
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => router.back()} className="btn btn-outline-secondary ltr:mr-3 rtl:ml-3">
                        <IconArrowLeft className="h-4 w-4" />
                    </button>
                    <h2 className="text-xl font-semibold">Create New Hero Slider</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input name="title" type="text" className="form-input" placeholder="18+ Years of Creative Exploration" value={formData.title} onChange={handleInputChange} required />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Subtitle */}
                <div>
                    <label className="block text-sm font-medium mb-2">Subtitle *</label>
                    <textarea
                        name="subtitle"
                        className="form-textarea"
                        rows={3}
                        placeholder="Learning, evolving, and growing through design"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
                </div>

                {/* Media Type */}
                <div>
                    <label className="block text-sm font-medium mb-2">Media Type *</label>
                    <select name="mediaType" className="form-select" value={formData.mediaType} onChange={handleInputChange} required>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>
                    {errors.mediaType && <p className="text-red-500 text-sm mt-1">{errors.mediaType}</p>}
                </div>

                {/* Media Upload */}
                {formData.mediaType === 'image' && (
                    <div className="space-y-4">
                        {/* Desktop Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Desktop Image *</label>
                            <div className="custom-file-container">
                                <ImageUploading value={images} onChange={onImageChange} maxNumber={1} dataURLKey="dataURL">
                                    {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                                        <div className="upload__image-wrapper">
                                            <button type="button" className="btn btn-outline-primary" onClick={onImageUpload}>
                                                Choose Desktop Image
                                            </button>
                                            {imageList.map((image, index) => (
                                                <div key={index} className="relative mt-4">
                                                    <img src={image.dataURL} alt="desktop preview" className="max-w-md rounded" />
                                                    <button type="button" className="absolute top-2 right-2 btn btn-danger btn-sm" onClick={() => onImageRemove(index)}>
                                                        <IconX className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ImageUploading>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Image for desktop view (recommended: 1920x800px)</p>
                        </div>

                        {/* Mobile Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Mobile Image</label>
                            <div className="custom-file-container">
                                <ImageUploading value={mobileImages} onChange={onMobileImageChange} maxNumber={1} dataURLKey="dataURL">
                                    {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                                        <div className="upload__image-wrapper">
                                            <button type="button" className="btn btn-outline-primary" onClick={onImageUpload}>
                                                Choose Mobile Image
                                            </button>
                                            {imageList.map((image, index) => (
                                                <div key={index} className="relative mt-4">
                                                    <img src={image.dataURL} alt="mobile preview" className="max-w-md rounded" />
                                                    <button type="button" className="absolute top-2 right-2 btn btn-danger btn-sm" onClick={() => onImageRemove(index)}>
                                                        <IconX className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ImageUploading>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Optional image for mobile view (recommended: 768x600px). If not provided, desktop image will be used.</p>
                        </div>
                    </div>
                )}

                {formData.mediaType === 'video' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Video *</label>
                        <input type="file" accept="video/*" onChange={handleVideoChange} className="form-input" required />
                        {videoPreview && (
                            <div className="mt-4">
                                <video controls className="max-w-md rounded">
                                    <source src={videoPreview} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                    </div>
                )}

                {/* Button Text */}
                <div>
                    <label className="block text-sm font-medium mb-2">Button Text</label>
                    <input name="buttonText" type="text" className="form-input" placeholder="Explore My Creations →" value={formData.buttonText || ''} onChange={handleInputChange} />
                    <p className="text-gray-500 text-sm mt-1">Optional button text to display on the slider</p>
                    {errors.buttonText && <p className="text-red-500 text-sm mt-1">{errors.buttonText}</p>}
                </div>

                {/* Button Link */}
                <div>
                    <label className="block text-sm font-medium mb-2">Button Link</label>
                    <input name="buttonLink" type="url" className="form-input" placeholder="https://example.com" value={formData.buttonLink || ''} onChange={handleInputChange} />
                    <p className="text-gray-500 text-sm mt-1">Optional URL for the button</p>
                    {errors.buttonLink && <p className="text-red-500 text-sm mt-1">{errors.buttonLink}</p>}
                </div>

                {/* Order */}
                <div>
                    <label className="block text-sm font-medium mb-2">Display Order *</label>
                    <input name="order" type="number" min="1" className="form-input" value={formData.order} onChange={handleInputChange} required />
                    <p className="text-gray-500 text-sm mt-1">Lower numbers appear first</p>
                    {errors.order && <p className="text-red-500 text-sm mt-1">{errors.order}</p>}
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium mb-2">Status *</label>
                    <select name="status" className="form-select" value={formData.status} onChange={handleInputChange} required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Hero Slider'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComponentsAppsHeroSliderCreate;
