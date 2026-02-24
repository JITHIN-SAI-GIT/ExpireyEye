import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

let model = null;

/**
 * Loads the MobileNet model if not already loaded.
 * @returns {Promise<Object>} The loaded model.
 */
export const loadModel = async () => {
    if (model) return model;
    
    try {
        console.log('Loading MobileNet...');
        model = await mobilenet.load({
            version: 1,
            alpha: 1.0
        });
        console.log('MobileNet Loaded Successfully');
        return model;
    } catch (error) {
        console.error('Failed to load model:', error);
        throw error;
    }
};

/**
 * Classifies an image or video element.
 * @param {HTMLImageElement|HTMLVideoElement} element - The element to classify.
 * @returns {Promise<Array>} List of predictions.
 */
export const classifyImage = async (element) => {
    const loadedModel = await loadModel();
    if (!loadedModel) return [];
    
    try {
        const predictions = await loadedModel.classify(element);
        return predictions;
    } catch (error) {
        console.error('Classification error:', error);
        return [];
    }
};
