import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../Layout/Metadata";
import Sidebar from "./SideBar";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from "../../utils/helpers";

const UpdateCategory = () => {
    const [name, setName] = useState("");
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState("");
     const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [updateError, setUpdateError] = useState("");
    const [isUpdated, setIsUpdated] = useState(false);
  
    let { id } = useParams();
    let navigate = useNavigate();
  
    const errMsg = (message = "") =>
      toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    const successMsg = (message = "") =>
      toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
  
    const getCategoryDetails = async (id) => {
      try {
        const { data } = await axios.get(
          `http://localhost:4001/api/v1/admin/category/${id}`
        );
        setCategory(data.category);
        setLoading(false);
      } catch (error) {
        setError(error.response.data.message);
      }
    };
  
    // const UpdateCategory = async (id, categoryData) => {
    //   try {
    //     const config = {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${getToken()}`,
    //       },
    //     };
    //     const { data } = await axios.put(
    //       `http://localhost:4001/api/v1/admin/category/${id}`,
    //       categoryData,
    //       config
    //     );
    //     setIsUpdated(data.success);
    //   } catch (error) {
    //     setUpdateError(error.response.data.message);
    //   }
    // };
    // useEffect(() => {
    //   if (category && category._id) {
    //     getCategoryDetails();
    //   } else {
    //     setName(category.name);
    //     setOldImages(category.images);
    //   }
    //   if (error) {
    //     errMsg(error);
    //   }
    //   if (updateError) {
    //     errMsg(updateError);
    //   }
    //   if (isUpdated) {
    //     navigate("/admin/category");
    //     successMsg("Category updated successfully");
    //   }
    // }, [error, isUpdated, updateError, category]);
  
    const UpdateCategory = async (id, categoryData) => {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          };
          const { data } = await axios.put(
            `http://localhost:4001/api/v1/admin/category/${id}`,
            categoryData,
            config
          );
          setIsUpdated(data.success);
        } catch (error) {
          setUpdateError(error.response.data.message);
        }
      };
      useEffect(() => {
        if (category && category._id !== id) {
          getCategoryDetails(id);
        } else {
          setName(category.name);
          setOldImages(category.images);
        }
        if (error) {
          errMsg(error);
        }
        if (updateError) {
          errMsg(updateError);
        }
        if (isUpdated) {
          navigate("/admin/category");
          successMsg("category updated successfully");
        }
      }, [error, isUpdated, updateError, category, id]);
    
    const submitHandler = (e) => {
      // console.log(e);
      e.preventDefault();
      const formData = new FormData();
      formData.set("name", name);
      images.forEach((image) => {
        formData.append("images", image);
      });
      console.log(images);
      UpdateCategory(category._id, formData);
    };
  
    const onChange = (e) => {
      const files = Array.from(e.target.files);
      setImagesPreview([]);
      setImages([]);
      setOldImages([]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setImagesPreview((oldArray) => [...oldArray, reader.result]);
            setImages((oldArray) => [...oldArray, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      });
    };
    return (
      <Fragment>
        <MetaData title={"Update Category"} />
        <div className="row">
          <div className="col-12 col-md-2">
            <Sidebar />
          </div>
          <div className="col-12 col-md-10">
            <Fragment>
              <div className="wrapper my-5">
                <form
                  className="shadow-lg"
                  onSubmit={submitHandler}
                  // encType="multipart/form-data"
                >
                  <h1 className="mb-4">Update Category</h1>
                  <div className="form-group">
                    <label htmlFor="name_field">Name</label>
                    <input
                      type="text"
                      id="name_field"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Images</label>
                    <div className="custom-file">
                      <input
                        type="file"
                        name="images"
                        className="custom-file-input"
                        id="customFile"
                        onChange={onChange}
                        multiple
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        Choose Images
                      </label>
                    </div>
                    {oldImages &&
                      oldImages.map((img) => (
                        <img
                          key={img}
                          src={img.url}
                          alt={img.url}
                          className="mt-3 mr-2"
                          width="55"
                          height="52"
                        />
                      ))}
                    {imagesPreview.map((img) => (
                      <img
                        src={img}
                        key={img}
                        alt="Images Preview"
                        className="mt-3 mr-2"
                        width="55"
                        height="52"
                      />
                    ))}
                  </div>
                  <button type="submit" className="btn update-btn btn-block mt-4 mb-3" >Update</button>
                </form>
              </div>
            </Fragment>
          </div>
        </div>
      </Fragment>
    );
  };
  
  export default UpdateCategory;
  