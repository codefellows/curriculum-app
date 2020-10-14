import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import axios from 'axios';

const styles = {
  image: {
    maxWidth: "600px",
    display: "block"
  }
}
export default function Image({ src, alt }) {

  const [imageSrc, setImageSrc] = useState(src);
  const curriculum = useSelector(state => state.curriculum)

  useEffect(() => {

    const getImage = async () => {

      const file = curriculum.file.replace(/[^/]+$/, '').replace(/^\/|\/$/, '');

      const queryParams = {
        repo: curriculum.repo,
        version: curriculum.version,
        path: file,
        image: src,
      };

      const source = await axios.get(`${process.env.REACT_APP_GITHUB_PROXY}/image`, { params: queryParams });

      if (!src.match(/^http/)) { setImageSrc(`data:image/jpeg;charset=utf-8;base64,${source.data}`); }

    }

    getImage();

  }, [curriculum, src]);

  return <img src={imageSrc} alt={alt} style={styles.image} />

}
