import { useState, type FormEvent } from "react";

const MIN_COMMENT_LENGTH = 10;

type ReviewFormProps = {
  onSubmit: (review: { rating: number; comment: string }) => void;
};

type ReviewErrors = { rating?: string; comment?: string };

function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<ReviewErrors>({});
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: ReviewErrors = {};
    if (rating < 1 || rating > 5) nextErrors.rating = "Choose a rating from 1 to 5.";
    if (comment.trim().length < MIN_COMMENT_LENGTH) nextErrors.comment = `Write at least ${MIN_COMMENT_LENGTH} characters.`;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({ rating, comment: comment.trim() });
    setRating(0);
    setComment("");
    setMessage("Thank you! Your review has been added.");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 rounded-2xl bg-brand-50 p-5">
      <h3 className="text-lg font-semibold text-slate-900">Write a review</h3>
      <fieldset className="mt-4" aria-describedby={errors.rating ? "review-rating-error" : undefined}>
        <legend className="text-sm font-medium text-slate-900">Rating</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className={`flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-700 ${rating === value ? "border-brand-700 bg-brand-700 text-white" : "border-brand-200 bg-white text-slate-700 hover:border-brand-500"}`}>
              <input type="radio" name="rating" value={value} checked={rating === value} onChange={() => { setRating(value); setErrors((current) => ({ ...current, rating: undefined })); setMessage(""); }} className="sr-only" />
              {value} <span className="sr-only">{value === 1 ? "star" : "stars"}</span>
            </label>
          ))}
        </div>
        {errors.rating && <p id="review-rating-error" role="alert" className="mt-2 text-sm text-amber-800">{errors.rating}</p>}
      </fieldset>
      <label htmlFor="review-comment" className="mt-4 block text-sm font-medium text-slate-900">Comment</label>
      <textarea
        id="review-comment"
        value={comment}
        onChange={(event) => { setComment(event.target.value); setErrors((current) => ({ ...current, comment: undefined })); setMessage(""); }}
        rows={3}
        aria-invalid={Boolean(errors.comment)}
        aria-describedby={errors.comment ? "review-comment-error" : undefined}
        className={`mt-2 w-full resize-y rounded-xl border bg-white p-3 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${errors.comment ? "border-amber-600" : "border-brand-200"}`}
      />
      {errors.comment && <p id="review-comment-error" role="alert" className="mt-2 text-sm text-amber-800">{errors.comment}</p>}
      <button type="submit" className="mt-4 min-h-11 rounded-lg bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
        Submit review
      </button>
      <p role="status" className="mt-2 text-sm text-brand-800">{message}</p>
    </form>
  );
}

export default ReviewForm;
