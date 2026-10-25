// Joins the class names that apply
export const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");
