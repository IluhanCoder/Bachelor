import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface AvatarCropModalProps {
    imageSrc: string;
    onSave: (croppedImage: Blob) => void;
    onCancel: () => void;
}

function AvatarCropModal({ imageSrc, onSave, onCancel }: AvatarCropModalProps) {
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const size = Math.min(width, height);
        const x = (width - size) / 2;
        const y = (height - size) / 2;
        
        setCrop({
            unit: 'px',
            width: size,
            height: size,
            x: x,
            y: y
        });
    }, []);

    const getCroppedImg = async () => {
        if (!completedCrop || !imgRef.current) return;

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        );

        return new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
            }, 'image/jpeg', 0.95);
        });
    };

    const handleSave = async () => {
        const croppedImage = await getCroppedImg();
        if (croppedImage) {
            onSave(croppedImage);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2 className="text-xl font-bold text-gray-900">Crop Avatar</h2>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Drag the corners to adjust the crop area. The avatar will be displayed as a circle.</span>
                            </div>
                        </div>

                        <div className="w-full max-w-2xl">
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={1}
                                circularCrop
                            >
                                <img
                                    ref={imgRef}
                                    src={imageSrc}
                                    alt="Crop preview"
                                    onLoad={onImageLoad}
                                    className="max-w-full h-auto"
                                />
                            </ReactCrop>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Save Avatar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AvatarCropModal;
