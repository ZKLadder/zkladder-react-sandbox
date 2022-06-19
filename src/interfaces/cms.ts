interface Post {
  id:string,
  postTitle:string,
  imageCaption:string,
  mainImage:{url:string},
  secondaryImage:{url:string},
  subTitle:string,
  fullDescription:string,
  postUrl:string
}

export type { Post };
