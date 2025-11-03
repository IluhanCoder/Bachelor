import { ReactNode } from "react";
import formStyle, {formContainerStyle, formSubContainerStyle} from "../styles/form-styles";
import formStore from "./form-store";
import { lightButtonStyle } from "../styles/button-syles";

interface LocalParams {
    formLabel: string,
    children: ReactNode
}

export default function FormComponent({formLabel,children}: LocalParams) {
    const handleSideClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            formStore.dropForm();
        }
    }

    // Determine modal width based on title
    const isWideForm = formLabel.toLowerCase().includes('user') || 
                       formLabel.toLowerCase().includes('invitation') ||
                       formLabel.toLowerCase().includes('search');
    
    const maxWidth = isWideForm ? 'max-w-5xl' : 'max-w-2xl';

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" 
            onClick={(event) => handleSideClick(event)}
        >
            <div className={`bg-white rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto animate-slideUp`}>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">{formLabel}</h2>
                    <button 
                        onClick={() => formStore.dropForm()}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}