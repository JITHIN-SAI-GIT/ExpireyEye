import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';

let model = null;

/**
 * Loads the MobileNet model if not already loaded.
 * Ensures TFJS is ready.
 */
export const loadModel = async () => {
    if (model) return model;
    
    try {
        console.log('Initializing TFJS...');
        await tf.ready();
        
        console.log('Loading MobileNet V2...');
        model = await mobilenet.load({
            version: 2,
            alpha: 0.75
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
    try {
        const loadedModel = await loadModel();
        if (!loadedModel) return [];
        
        const predictions = await loadedModel.classify(element);
        return predictions;
    } catch (error) {
        console.error('Classification error:', error);
        return [];
    }
};
