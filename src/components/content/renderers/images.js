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

      if (!src.match(/^http/)) {

        const file = curriculum.file.path.replace(/[^/]+$/, '').replace(/^\/|\/$/g, '');

        const repo = curriculum.file.repository;

        const org = 'codefellows';

        const version = curriculum.pages.dependencies[repo];

        const queryParams = {
          org,
          repo,
          version,
          path: file,
          image: src,
        };

        const source = await axios.get(`${process.env.REACT_APP_GITHUB_PROXY}/image`, { params: queryParams });

        setImageSrc(`data:image/jpeg;charset=utf-8;base64,${source.data}`);
      }

    }

    getImage();

  }, [curriculum, src]);

  return <img src={imageSrc} alt={alt} style={styles.image} />

}
