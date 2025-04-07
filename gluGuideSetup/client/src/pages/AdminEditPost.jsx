import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "../styles/EditPost.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faXmark, faSave } from "@fortawesome/free-solid-svg-icons";

const AdminEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/getPost/${id}`, { withCredentials: true })
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setImageUrl(
          res.data.post_picture
            ? `http://localhost:8080/uploads/${res.data.post_picture}`
            : ""
        );
      })
      .catch(() => setError("Failed to load post."));
  }, [id]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/admin/posts/${id}`,
        { title, content },
        { withCredentials: true }
      );
      navigate(`/blogs/view/${id}`);
    } catch (err) {
      setError("Failed to save post.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("postImage", image);

    try {
      const response = await axios.post(
        `http://localhost:8080/uploadPostImage/${id}`,
        formData,
        { withCredentials: true }
      );
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image.");
    }
  };

  const handleDeleteImage = async () => {
    try {
      await axios.delete(`http://localhost:8080/deletePostImage/${id}`, {
        withCredentials: true,
      });
      setImageUrl("");
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Failed to delete image.");
    }
  };

  return (
    <div className={styles.editPostContainer}>
      <h2 className={styles.title}>Edit Post "{title}" (as Admin)</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.form}>
        {/* Post Title */}
        <label className={styles.label}>Post Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />

        {/* Post Content */}
        <label className={styles.label}>Content:</label>
        <ReactQuill
          value={content}
          onChange={setContent}
          className={styles.quillEditor}
        />

        {/* Current Post Image */}
        <label className={styles.label}>Current Post Image:</label>
        {imageUrl ? (
          <>
            <div className={styles.imagePreview}>
              <img
                src={imageUrl}
                alt="Post Preview"
                className={styles.previewImage}
              />
            </div>
            <div className={styles.inputField}>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={handleDeleteImage}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className={styles.iconSpacing}
                />
                Remove Image
              </button>
            </div>
          </>
        ) : (
          <>
            <p>There is no current image set.</p>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleDeleteImage}
              disabled
            >
              <FontAwesomeIcon icon={faTrash} className={styles.iconSpacing} />
              Remove Image
            </button>
          </>
        )}

        <label className={styles.label}>Upload New Image:</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className={styles.fileInput}
        />
        <small>First choose a new image, then click "Upload Image"!</small>
        <button onClick={handleUploadImage} className={styles.uploadButton}>
          Upload Image
        </button>
        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className={styles.saveButton}
          >
            <FontAwesomeIcon icon={faSave} className={styles.iconSpacing} />
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/blogs/view/${id}`)}
            className={styles.cancelButton}
          >
            <FontAwesomeIcon icon={faXmark} className={styles.iconSpacing} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditPost;
