"use client";

import {
  useForm,
  Controller,
  FieldValues,
  FieldPath,
  FieldErrors,
  SubmitHandler,
  DefaultValues,
} from "react-hook-form";
import Link from "next/link";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import es from "react-phone-number-input/locale/es";
import { HiArrowSmRight, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useState } from "react";
import styles from "./Form.module.css";

/** —— Tipos de campos —— */
type BaseField = {
  label?: string;
};

type NamedField<T extends FieldValues> = BaseField & {
  name: FieldPath<T>;
};

export type TextField<T extends FieldValues> = NamedField<T> & {
  type: "text" | "password";
  required?: string; // mensaje si es requerido
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
};

export type PhoneField<T extends FieldValues> = NamedField<T> & {
  type: "phoneNumber";
  required?: string; // mensaje si es requerido
};

export type SpanField = BaseField & {
  type: "span";
  link: string;
};

export type SubmitField = BaseField & {
  type: "submit";
};

export type Field<T extends FieldValues> =
  | TextField<T>
  | PhoneField<T>
  | SpanField
  | SubmitField;

/** —— Props del formulario —— */
type Props<T extends FieldValues> = {
  title: string;
  onSubmitForm: SubmitHandler<T>;
  fields: Field<T>[];
  defaultValues: DefaultValues<T>;
  /** Opcional: mensajes extra por campo (por clave), si quieres mostrarlos */
  defaultValuesError?: Partial<Record<FieldPath<T>, string>>;
};

export default function Form<T extends FieldValues>({
  title,
  onSubmitForm,
  fields,
  defaultValues,
}: //   defaultValuesError,
Props<T>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<T>({ defaultValues });

  const [isPass, setPass] = useState(true);

  // Utilidad: revisar si hay error para una clave (sin usar 'any')
  const hasError = (name: FieldPath<T>, errs: FieldErrors<T>): boolean => {
    return Boolean((errs as unknown as Record<string, unknown>)[name]);
  };

  // —— Render de cada campo (sin 'any') ——
  const renderField = (field: Field<T>, idx: number) => {
    switch (field.type) {
      case "text": {
        const f = field as TextField<T>;
        const rules =
          f.required || f.minLength || f.maxLength
            ? {
                required: f.required
                  ? { value: true, message: f.required }
                  : undefined,
                minLength: f.minLength
                  ? {
                      value: f.minLength,
                      message: `Mínimo ${f.minLength} caracteres`,
                    }
                  : undefined,
                maxLength: f.maxLength
                  ? {
                      value: f.maxLength,
                      message: `Máximo ${f.maxLength} caracteres`,
                    }
                  : undefined,
                validate: (val: string) =>
                  (val?.trim()?.length ?? 0) > 0 || f.required || true,
              }
            : undefined;

        return (
          <label key={`f-${idx}`} className={styles.form__label}>
            {f.label && (
              <span className={styles["form__name-input"]}>{f.label}</span>
            )}
            <input
              className={styles.form__input}
              placeholder={f.placeholder}
              {...register(f.name, rules)}
            />
            {hasError(f.name, errors) && (
              <small className={styles.form__error}>
                {(errors as Record<string, { message?: string }>)[f.name]
                  ?.message ?? f.required}
              </small>
            )}
          </label>
        );
      }

      case "password": {
        const f = field as TextField<T>;
        const rules =
          f.required || f.minLength || f.maxLength
            ? {
                required: f.required
                  ? { value: true, message: f.required }
                  : undefined,
                minLength: f.minLength
                  ? {
                      value: f.minLength,
                      message: `Mínimo ${f.minLength} caracteres`,
                    }
                  : undefined,
                maxLength: f.maxLength
                  ? {
                      value: f.maxLength,
                      message: `Máximo ${f.maxLength} caracteres`,
                    }
                  : undefined,
                validate: (val: string) =>
                  (val?.trim()?.length ?? 0) > 0 || f.required || true,
              }
            : undefined;

        return (
          <label key={`f-${idx}`} className={styles.form__label}>
            {f.label && (
              <span className={styles["form__name-input"]}>{f.label}</span>
            )}
            <div className={styles.viewPassword}>
              <input
                type={isPass ? "password" : "text"}
                className={styles.form__input}
                placeholder={f.placeholder}
                {...register(f.name, rules)}
              />
              <span
                className={styles.viewIcon}
                onClick={() => setPass(!isPass)}
              >
                {isPass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </span>
            </div>
            {hasError(f.name, errors) && (
              <small className={styles.form__error}>
                {(errors as Record<string, { message?: string }>)[f.name]
                  ?.message ?? f.required}
              </small>
            )}
          </label>
        );
      }

      case "phoneNumber": {
        const f = field as PhoneField<T>;
        return (
          <label key={`f-${idx}`} className={styles.form__label}>
            {f.label && (
              <span className={styles["form__name-input"]}>{f.label}</span>
            )}
            <Controller<T, FieldPath<T>>
              name={f.name}
              control={control}
              rules={{
                validate: (val: string | undefined) =>
                  (val && isValidPhoneNumber(val)) ||
                  f.required ||
                  "Teléfono inválido",
              }}
              render={({ field: rhfField }) => (
                <PhoneInput
                  international
                  labels={es}
                  value={rhfField.value as string | undefined}
                  onChange={(val) => rhfField.onChange(val)}
                />
              )}
            />
            {hasError(f.name, errors) && (
              <small className={styles.form__error}>
                {(errors as Record<string, { message?: string }>)[f.name]
                  ?.message ?? f.required}
              </small>
            )}
          </label>
        );
      }

      case "span": {
        const f = field as SpanField;
        return (
          <div key={`f-${idx}`} className={styles.form__link}>
            <Link href={f.link} className={styles.form__span}>
              {f.label}
            </Link>
          </div>
        );
      }

      case "submit": {
        const f = field as SubmitField;
        return (
          <button className="login_button" type="submit" key={`f-${idx}`}>
            {f.label}
            {f.label === "Siguiente" && <HiArrowSmRight />}
          </button>
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={styles.form}>
      <h3 className={styles.form__title}>{title}</h3>
      {fields.map(renderField)}
    </form>
  );
}
