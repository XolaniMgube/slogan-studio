import { CATEGORIES, GRADES, GRADE_NAME } from "@/lib/types";
import { AdminProduct } from "@/lib/products-db";
import { SubmitButton } from "@/components/submit-button";
import { saveProductAction } from "../actions";

const statuses = ["draft", "active", "sold_out", "archived"] as const;

export function ProductForm({ product, disabled = false }: { product?: AdminProduct; disabled?: boolean }) {
  return (
    <form action={saveProductAction} className="grid gap-6">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      {disabled && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Add Supabase admin env vars before saving product changes.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Product name" name="name" defaultValue={product?.name} required disabled={disabled} />
        <Field label="Slug" name="slug" defaultValue={product?.slug} required disabled={disabled} />
        <Field label="SKU" name="sku" defaultValue={product?.sku} disabled={disabled} />
        <Field label="Brand" name="brand" defaultValue={product?.brand} disabled={disabled} />
        <Field label="Model" name="model" defaultValue={product?.model} disabled={disabled} />
        <label className="grid gap-1.5">
          <span className="font-display text-sm font-semibold">Category</span>
          <select name="category" defaultValue={product?.category ?? "Laptops"} disabled={disabled} className="input">
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="font-display text-sm font-semibold">Grade</span>
          <select name="grade" defaultValue={product?.grade ?? "A"} disabled={disabled} className="input">
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>
                {GRADE_NAME[grade]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className="font-display text-sm font-semibold">Status</span>
          <select name="status" defaultValue={product?.status ?? "draft"} disabled={disabled} className="input">
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <Field label="Price" name="price" type="number" min="0" step="1" defaultValue={product?.price ?? 0} required disabled={disabled} />
        <Field label="Compare at" name="compareAt" type="number" min="0" step="1" defaultValue={product?.compareAt} disabled={disabled} />
        <Field label="Shipping" name="shipping" type="number" min="0" step="1" defaultValue={product?.shipping ?? 150} required disabled={disabled} />
        <Field label="Stock quantity" name="stock" type="number" min="0" step="1" defaultValue={product?.stock ?? 0} required disabled={disabled} />
        <Field label="Low stock threshold" name="lowStockThreshold" type="number" min="0" step="1" defaultValue={product?.lowStockThreshold ?? 1} disabled={disabled} />
        <Field label="Warranty months" name="warrantyMonths" type="number" min="0" step="1" defaultValue={product?.warrantyMonths ?? 3} disabled={disabled} />
      </div>

      <Field label="Short spec line" name="spec" defaultValue={product?.spec} required disabled={disabled} />
      <TextArea label="Description" name="description" defaultValue={product?.description} rows={5} disabled={disabled} />
      <TextArea label="Specs, one per line" name="specs" defaultValue={product?.specs.join("\n")} rows={5} disabled={disabled} />
      <input type="hidden" name="existingImages" value={product?.images.join("\n") ?? ""} />
      <div className="grid gap-3 rounded-lg border border-hairline bg-paper-2 p-4">
        <div>
          <p className="font-display text-sm font-semibold">Product images</p>
          <p className="mt-1 text-sm text-muted">Upload up to 3 JPG, PNG or WebP images. New uploads replace existing images.</p>
        </div>
        {product?.images.length ? (
          <div className="grid gap-2 text-sm text-muted">
            <p className="font-medium text-ink">Current images</p>
            {product.images.slice(0, 3).map((image) => (
              <span key={image} className="truncate rounded-md border border-hairline bg-white px-3 py-2">
                {image}
              </span>
            ))}
          </div>
        ) : null}
        <div className="grid gap-3 md:grid-cols-3">
          <FileField label="Image 1" name="image1" disabled={disabled} />
          <FileField label="Image 2" name="image2" disabled={disabled} />
          <FileField label="Image 3" name="image3" disabled={disabled} />
        </div>
      </div>
      <TextArea label="Condition notes" name="conditionNotes" defaultValue={product?.conditionNotes} rows={3} disabled={disabled} />

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm">
          <input name="isFeatured" type="checkbox" defaultChecked={product?.featured ?? false} disabled={disabled} className="accent-volt" />
          Featured product
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="isVisible" type="checkbox" defaultChecked={product?.isVisible ?? true} disabled={disabled} className="accent-volt" />
          Visible on storefront
        </label>
      </div>

      <SubmitButton disabled={disabled} pendingLabel="Saving product…" className="w-fit">
        Save product
      </SubmitButton>
    </form>
  );
}

function Field({ label, className, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`grid gap-1.5 ${className ?? ""}`}>
      <span className="font-display text-sm font-semibold">{label}</span>
      <input {...props} className="input" />
    </label>
  );
}

function TextArea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="grid gap-1.5">
      <span className="font-display text-sm font-semibold">{label}</span>
      <textarea {...props} className="input resize-y" />
    </label>
  );
}

function FileField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1.5">
      <span className="font-display text-sm font-semibold">{label}</span>
      <input {...props} type="file" accept="image/jpeg,image/png,image/webp" className="input file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-1.5 file:font-display file:text-sm file:font-semibold file:text-white" />
    </label>
  );
}
