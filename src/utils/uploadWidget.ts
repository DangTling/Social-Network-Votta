
const uploadWidget = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ml_default");

        fetch(`https://api.cloudinary.com/v1_1/dyaldfz9t/upload`, {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.secure_url) {
                    resolve(data.secure_url);
                } else {
                    reject(new Error("Upload failed"));
                }
            })
            .catch(error => {
                reject(error);
            });
    });
};

export default uploadWidget;
