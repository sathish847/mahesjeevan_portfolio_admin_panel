'use client';
import React, { useState, useEffect } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
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
    type?: string;
    videoUrl?: string;
    desktopImage?: string;
    mobileImage?: string;
    title?: string;
    subtitle?: string;
    mediaType?: string;
    buttonText?: string;
    buttonLink?: string;
    status?: string;
    order?: string;
}

interface HeroSlider {
    _id: string;
    type: 'image' | 'video';
    videoUrl?: string;
    desktopImage?: string;
    mobileImage?: string;
    title: string;
    subtitle: string;
    buttonText?: string;
    buttonLink?: string;
    status: 'active' | 'inactive';
    order: number;
    createdAt: string;
    updatedAt: string;
}

const ComponentsAppsHeroSliderEdit = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const sliderId = params.id as string;

    const [images, setImages] = useState<any>([]);
    const [mobileImages, setMobileImages] = useState<any>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentSlider, setCurrentSlider] = useState<HeroSlider | null>(null);
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

    // Fetch hero slider data for editing
    useEffect(() => {
        const fetchHeroSlider = async () => {
            if (!session?.accessToken || !sliderId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/api/hero-sliders/admin/all`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch hero sliders');
                }

                const data = await response.json();
                const slider = data.heroSliders.find((s: HeroSlider) => s._id === sliderId);

                if (slider) {
                    setCurrentSlider(slider);
                    setFormData({
                        title: slider.title,
                        subtitle: slider.subtitle,
                        mediaType: slider.type,
                        buttonText: slider.buttonText || '',
                        buttonLink: slider.buttonLink || '',
                        status: slider.status,
                        order: slider.order,
                    });

                    // Set existing media previews
                    if (slider.type === 'image') {
                        if (slider.desktopImage) {
                            setImages([{ dataURL: slider.desktopImage, file: null }]);
                        }
                        if (slider.mobileImage) {
                            setMobileImages([{ dataURL: slider.mobileImage, file: null }]);
                        }
                    } else if (slider.type === 'video' && slider.videoUrl) {
                        setVideoPreview(slider.videoUrl);
                    }
                } else {
                    alert('Hero slider not found');
                    router.push('/apps/hero-slider');
                }
            } catch (error) {
                console.error('Error fetching hero slider:', error);
                alert('Failed to load hero slider data');
                router.push('/apps/hero-slider');
            } finally {
                setLoading(false);
            }
        };

        fetchHeroSlider();
    }, [session?.accessToken, sliderId, router]);

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

        // Media validation - only check if new files are being uploaded
        if (formData.mediaType === 'image') {
            // For images, we need either existing images or new uploads
            const hasExistingDesktop = currentSlider?.type === 'image' && currentSlider.desktopImage;
            const hasNewDesktop = images.length > 0 && images[0].file;
            if (!hasExistingDesktop && !hasNewDesktop) {
                newErrors.mediaType = 'Please select a desktop image';
            }
        }

        if (formData.mediaType === 'video') {
            // For videos, we need either existing video or new upload
            const hasExistingVideo = currentSlider?.type === 'video' && currentSlider.videoUrl;
            const hasNewVideo = videoFile;
            if (!hasExistingVideo && !hasNewVideo) {
                newErrors.mediaType = 'Please select a video file';
            }
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
            alert('You must be logged in to update a hero slider');
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

            // Add media files only if new ones are selected
            if (formData.mediaType === 'image') {
                if (images.length > 0 && images[0].file) {
                    formDataToSend.append('desktopImage', images[0].file);
                }
                if (mobileImages.length > 0 && mobileImages[0].file) {
                    formDataToSend.append('mobileImage', mobileImages[0].file);
                }
                setUploadProgress(75);
            } else if (formData.mediaType === 'video' && videoFile) {
                formDataToSend.append('videoFile', videoFile);
                setUploadProgress(75);
            } else {
                setUploadProgress(50);
            }

            // Update hero slider - use appropriate endpoint based on media type
            const endpoint =
                formData.mediaType === 'video'
                    ? `${process.env.NEXT_PUBLIC_BACKENDURL}/api/hero-sliders/video/${sliderId}`
                    : `${process.env.NEXT_PUBLIC_BACKENDURL}/api/hero-sliders/image/${sliderId}`;

            const headers: Record<string, string> = {
                Authorization: `Bearer ${session.accessToken}`,
            };

            // Use FormData for both video and image endpoints (multipart/form-data)
            const body = formDataToSend;

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers,
                body,
            });

            setUploadProgress(100);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update hero slider');
            }

            const result = await response.json();
            alert('Hero slider updated successfully!');
            router.push('/apps/hero-slider');
        } catch (error) {
            console.error('Error updating hero slider:', error);
            alert(`Failed to update hero slider: ${error instanceof Error ? error.message : 'Please try again.'}`);
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    if (loading) {
        return (
            <div className="panel">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading hero slider data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="panel">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => router.back()} className="btn btn-outline-secondary ltr:mr-3 rtl:ml-3">
                        <IconArrowLeft className="h-4 w-4" />
                    </button>
                    <h2 className="text-xl font-semibold">Edit Hero Slider</h2>
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
                            <label className="block text-sm font-medium mb-2">Desktop Image</label>
                            <div className="custom-file-container">
                                <ImageUploading value={images} onChange={onImageChange} maxNumber={1} dataURLKey="dataURL">
                                    {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                                        <div className="upload__image-wrapper">
                                            <button type="button" className="btn btn-outline-primary" onClick={onImageUpload}>
                                                Choose New Desktop Image
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
                            <p className="text-gray-500 text-sm mt-1">Leave empty to keep the current desktop image (recommended: 1920x800px)</p>
                        </div>

                        {/* Mobile Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Mobile Image</label>
                            <div className="custom-file-container">
                                <ImageUploading value={mobileImages} onChange={onMobileImageChange} maxNumber={1} dataURLKey="dataURL">
                                    {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                                        <div className="upload__image-wrapper">
                                            <button type="button" className="btn btn-outline-primary" onClick={onImageUpload}>
                                                Choose New Mobile Image
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
                            <p className="text-gray-500 text-sm mt-1">Optional image for mobile view (recommended: 768x600px). Leave empty to keep current or use desktop image.</p>
                        </div>
                    </div>
                )}

                {formData.mediaType === 'video' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Video</label>
                        <input type="file" accept="video/*" onChange={handleVideoChange} className="form-input" />
                        {videoPreview && (
                            <div className="mt-4">
                                <video controls className="max-w-md rounded">
                                    <source src={videoPreview} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                        <p className="text-gray-500 text-sm mt-1">Leave empty to keep the current video</p>
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
                        {isSubmitting ? 'Updating...' : 'Update Hero Slider'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ComponentsAppsHeroSliderEdit;
