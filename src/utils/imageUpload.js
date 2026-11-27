// Uploaded images are stored in the page JSON as data URLs, so they are downscaled first to keep saves small.
export function readImageFile(file, maxSize = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) return reject(new Error("Not an image"));
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      // SVG and GIF keep their original data (vector / animation would be lost on a canvas).
      if (/svg|gif/.test(file.type)) return resolve(reader.result);
      const img = new Image();
      img.onerror = () => reject(new Error("Unreadable image"));
      img.onload = () => {
        const k = Math.min(1, maxSize / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
