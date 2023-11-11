import Date from "./date";
import CoverImage from "./cover-image";
import Link from "next/link";

export default function BlogPreview({
  title,
  coverImage,
  date,
  excerpt,
  languageId,
  //   author,
  slug,
}) {
  return (
    <div>
      <div className="mb-5">
        {coverImage && (
          <CoverImage
            title={title}
            coverImage={coverImage}
            slug={slug}
            languageId={languageId}
          />
        )}
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link
          href={`/blog-content/${slug}/${languageId}`}
          className="hover:underline"
          dangerouslySetInnerHTML={{ __html: title }}
        ></Link>
      </h3>

      <div
        className="text-lg leading-relaxed mb-4"
        dangerouslySetInnerHTML={{ __html: excerpt }}
      />
      <div className="text-lg mb-4">
        <Date dateString={date} />
      </div>
      {/* <Avatar author={author} /> */}
    </div>
  );
}
