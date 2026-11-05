import type { Product } from "../../types/product";
import type { ProductOptions } from "../../types/cart";
import { getProductOptions } from "../../models/productOptions";

type OptionPickerProps = {
  product: Pick<Product, "id" | "category">;
  value: ProductOptions;
  onChange: (value: ProductOptions) => void;
  /** Keeps radio group names unique when the same product appears twice on a page. */
  idPrefix: string;
};

const chip = "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet-700";
const selectedChip = "border-violet-700 bg-violet-50 text-violet-800 ring-2 ring-violet-200";
const idleChip = "border-slate-200 bg-white text-slate-700 hover:border-violet-400";

/** Colour and size choice, built from native radio buttons so it works with the keyboard. */
function OptionPicker({ product, value, onChange, idPrefix }: OptionPickerProps) {
  const { colors, sizes } = getProductOptions(product);

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900">
          Color: <span className="font-normal text-slate-600">{value.color}</span>
        </legend>
        {/* Round swatches keep every colour on one row; the name is in the legend and tooltip. */}
        <div className="mt-2 flex flex-nowrap gap-2">
          {colors.map((color) => {
            const selected = value.color === color.name;
            return (
              <label
                key={color.name}
                title={color.name}
                className={`flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet-700 ${selected ? "border-violet-700 ring-2 ring-violet-200" : "border-transparent hover:border-violet-300"}`}
              >
                <input
                  type="radio"
                  name={`${idPrefix}-color`}
                  value={color.name}
                  checked={selected}
                  onChange={() => onChange({ ...value, color: color.name })}
                  className="sr-only"
                />
                <span aria-hidden="true" className="size-8 rounded-full border border-slate-300 shadow-inner" style={{ background: color.swatch }} />
                <span className="sr-only">{color.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-slate-900">
          Size: <span className="font-normal text-slate-600">{value.size}</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <label key={size} className={`${chip} min-w-11 justify-center ${value.size === size ? selectedChip : idleChip}`}>
              <input
                type="radio"
                name={`${idPrefix}-size`}
                value={size}
                checked={value.size === size}
                onChange={() => onChange({ ...value, size })}
                className="sr-only"
              />
              {size}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export default OptionPicker;
