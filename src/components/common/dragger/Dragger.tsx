import * as React from "react";
import { Upload, message } from "antd";
import { useEffect, useState } from "react";
import type { RcFile } from "antd/es/upload/interface";
import Spin from "../spin";
import { Image } from "antd";
import axios from "axios";
import Svg from "../svg";

function Dragger({
  text,
  hint,
  disabled,
  url = "",
  style = {},
  image,
  imageViewUrl,
  imageStyle = {},
  onFileReceive,
  reload,
  onRemove,
  maxCount,
  showAfterUpload = true,
  onDone,
  loading: dataLoading,
  ignoreHashList = [],
  maxFileSize = 1024,
  formats = ".jpg, .jpeg, .png, .webp",
}: {
  url?: string;
  image?: string;
  imageViewUrl?: string;
  text?: string;
  hint?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  onFileReceive?: (file: File) => void;
  reload?: Date;
  maxCount?: number;
  onRemove?: () => void;
  showAfterUpload?: boolean;
  onDone?: (url: string, data: any) => void;
  loading?: boolean;
  ignoreHashList?: string[];
  maxFileSize?: number;
  formats?: string;
}) {
  const [imageFile, setImageFile] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const { Dragger } = Upload;

  useEffect(() => {
    function downloadImage(imagePath?: string) {
      if (!imagePath) return;
      setLoading(true);
      axios({
        url: imagePath,
        headers: {},
        responseType: "blob", // important
      })
        .then((res) => {
          try {
            // if your response image is base64 set responseType: "blob" in params
            const uri = URL.createObjectURL(res?.data);
            res?.data && setImageFile(uri);
          } catch (e) {
            console.log("useImage.catch");
            try {
              res?.data && setImageFile(res?.data);
              // res?.data && setSrc(`data:image/jpeg;base64,${res?.data}`);
            } catch (e) {
              console.error("useImage : ", e);
            }
          }
        })
        .catch((e) => {
          console.log("e", e);
        })
        .finally(() => setLoading(false));
    }
    downloadImage(image);
  }, [image, reload]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLoading(dataLoading);
  }, [dataLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  function getDraggerProps() {
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    const props = {
      name: "image",
      multiple: false,
      // responseType: "blob", // important
      // headers,
      accept: formats,
      customRequest: (options: any) => {
        const data = new FormData();
        data.append("image", options.file);
        axios
          .post(url, data, config)
          .then((res: any) => {
            options.onSuccess(res.data, options.file);
          })
          .catch((e) => {
            options.onError({ event: e });
          });
      },
      beforeUpload: (file: File) => {
        const hash = file.lastModified + "" + file.size;
        if (ignoreHashList.includes(hash)) {
          message.error("این فایل قبلا انتخاب شده است");
          return false;
        }
        const isLt2M = file.size / 1024 < maxFileSize;
        if (!isLt2M) {
          // file.flag = true;
          message.error(
            `حداکثر سایز فایل برای ارسال ${maxFileSize} کیلوبایت می باشد`,
          );
          return false;
        }
        setLoading(true);
        if (onFileReceive) {
          return onFileReceive(file);
        }
        return true;
      },

      onChange(info: any) {
        setLoading(false);
        const { status } = info.file;
        // if (status !== "uploading") {
        //   console.log(info.file, info.fileList);
        // }
        if (status === "done") {
          getBase64(info.file.originFileObj as RcFile, (url) => {
            setLoading(false);
            setImageFile(url);
            onDone && onDone(url, info.file.response);
          });
        } else if (status === "error") {
          message.error(
            info?.file?.response?.message || `الصاق فایل با خطا مواجه شد`,
          );
        }
      },
    };
    return props;
  }

  return (
    <div style={{ padding: "25px 30px 0", ...style }}>
      <Dragger
        onRemove={() => {
          setImageFile(undefined);
          onRemove && onRemove();
        }}
        style={{
          overflow: "hidden",
          borderRadius: 8,
          border: "1px dashed #000",
          background: "#FFF",
        }}
        maxCount={maxCount || 1}
        {...getDraggerProps()}
        disabled={disabled !== undefined && disabled}
      >
        <>
          <div>
            {!loading &&
              ((!imageFile && !image && !imageViewUrl) || !showAfterUpload) && (
                <Svg
                  src={"/static/svg/plus.svg"}
                  alt={"more icon"}
                  width={24}
                  height={24}
                  style={{ margin: 5 }}
                />
              )}
            {!loading &&
              ((!imageFile && !image && !imageViewUrl) || !showAfterUpload) && (
                <p
                  className="ant-upload-text"
                  style={{ marginBottom: image ? 10 : 0, color: "#8c8c8c" }}
                >
                  {text}
                </p>
              )}
            {!loading &&
              ((!imageFile && !image && !imageViewUrl) || !showAfterUpload) && (
                <p className="ant-upload-hint" style={{ color: "#ccc9c9" }}>
                  {hint}
                </p>
              )}
          </div>

          {!loading && imageFile && showAfterUpload && (
            <div
              style={{
                backgroundImage: `url(${imageFile})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                ...imageStyle,
              }}
            />
          )}
          {imageViewUrl && (
            <Image
              alt={""}
              src={imageViewUrl}
              style={{ height: 200, width: "100%" }}
              preview={false}
            />
          )}
          {loading && <Spin />}
        </>
      </Dragger>
    </div>
  );
}

export default React.memo(Dragger);
