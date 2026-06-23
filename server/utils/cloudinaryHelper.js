const cloudinary = require('../configs/cloundinary');

/**
 * Extract public_id from Cloudinary URL
 * URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}.{ext}
 */
const extractPublicId = (url) => {
    try {
        if (!url) return null;

        // Extract the part after '/upload/' and before the file extension
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);

        if (match && match[1]) {
            return match[1];
        }
        return null;
    } catch (error) {
        console.error('Error extracting public_id:', error.message);
        return null;
    }
};

/**
 * Delete file from Cloudinary by public_id
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            console.warn('No public_id provided for deletion');
            return false;
        }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            console.log(`File deleted successfully: ${publicId}`);
            return true;
        } else {
            console.warn(`Failed to delete file: ${publicId}`, result);
            return false;
        }
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error.message);
        return false;
    }
};

/**
 * Delete avatar and return the result
 */
const deleteAvatarFromCloudinary = async (avatarUrl) => {
    try {
        const publicId = extractPublicId(avatarUrl);

        if (!publicId) {
            console.warn('Could not extract public_id from URL:', avatarUrl);
            return false;
        }

        return await deleteFromCloudinary(publicId);
    } catch (error) {
        console.error('Error deleting avatar:', error.message);
        return false;
    }
};

/**
 * Delete every Cloudinary asset inside a folder and remove the folder itself.
 * This is useful for lesson folders like:
 * multicourse/courses/<course_id>/lesson/<lesson_number>
 */
const deleteFolderFromCloudinary = async (folderPath) => {
    try {
        if (!folderPath) {
            console.warn('No folder path provided for deletion');
            return false;
        }

        const resourceTypes = ['image', 'video', 'raw'];

        for (const resourceType of resourceTypes) {
            await cloudinary.api.delete_resources_by_prefix(folderPath, {
                resource_type: resourceType,
            });
        }

        await cloudinary.api.delete_folder(folderPath);
        console.log(`Folder deleted successfully: ${folderPath}`);
        return true;
    } catch (error) {
        console.error('Error deleting Cloudinary folder:', error.message);
        return false;
    }
};

module.exports = {
    extractPublicId,
    deleteFromCloudinary,
    deleteAvatarFromCloudinary,
    deleteFolderFromCloudinary
};
