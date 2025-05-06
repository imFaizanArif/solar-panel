import React, { useState, useEffect } from "react";
import { Grid, TextField, IconButton } from "@mui/material";
import { Field } from "formik";
import Select from "react-select";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const MAX_DYNAMIC_ROWS = 4;

const DynamicFields = ({
  options,
  touched,
  errors,
  setFieldValue,
  setPrices,
  setQuantities,
  values,
  namePrefix = "solar_panel",
  pricePrefix = "solar_panel_price",
  quantityPrefix = "solar_panel_quantity",
}) => {
  const [rows, setRows] = useState([]);
  const [availableIds, setAvailableIds] = useState([1]);

  const removeCommas = (value) => value.replace(/,/g, "");
  const formatWithCommas = (value) => {
    if (value === "" || value === 0) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 🔁 Auto-create rows based on existing values
  useEffect(() => {
    const existingSuffixes = Object.keys(values)
      .filter((key) => key.startsWith(namePrefix))
      .map((key) => key.replace(namePrefix, ""))
      .filter((suffix) => suffix !== "" && !isNaN(suffix))
      .map(Number)
      .filter((suffix) => {
        const value = values[`${namePrefix}${suffix}`];
        return value !== null && value !== undefined && value !== "";
      })
      .sort((a, b) => a - b);

    if (existingSuffixes.length > 0) {
      const newRows = existingSuffixes.map((id) => ({ id }));
      setRows(newRows);

      // Remove used IDs from available pool
      setAvailableIds((prev) =>
        prev.filter((id) => !existingSuffixes.includes(id))
      );
    }
  }, [values, namePrefix]);

  const handleAddRow = () => {
    if (rows.length < MAX_DYNAMIC_ROWS) {
      const newId =
        availableIds.length > 0
          ? availableIds[0]
          : Math.max(0, ...rows.map((r) => r.id)) + 1;

      setRows((prevRows) => [...prevRows, { id: newId }]);
      setAvailableIds((prev) => prev.filter((id) => id !== newId));
    }
  };

  const handleRemoveRow = (idToRemove) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== idToRemove));

    setFieldValue(`${namePrefix}${idToRemove}`, "");
    setFieldValue(`${pricePrefix}${idToRemove}`, 0);
    setFieldValue(`${quantityPrefix}${idToRemove}`, 0);

    setPrices((prev) => {
      const updated = { ...prev };
      delete updated[idToRemove];
      return updated;
    });

    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[idToRemove];
      return updated;
    });

    setAvailableIds((prev) => [...prev, idToRemove].sort((a, b) => a - b));
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Field name={namePrefix}>
            {({ field, form }) => (
              <Select
                options={options}
                name={namePrefix}
                value={options.find((opt) => opt.value === field.value) || null}
                onChange={(option) =>
                  form.setFieldValue(namePrefix, option?.value || "")
                }
                placeholder="Select Option"
                isClearable
              />
            )}
          </Field>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Field name={quantityPrefix}>
            {({ field }) => (
              <TextField
                {...field}
                label="Quantity"
                type="number"
                fullWidth
                helperText={touched[quantityPrefix] && errors[quantityPrefix]}
                error={Boolean(
                  touched[quantityPrefix] && errors[quantityPrefix]
                )}
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                  setFieldValue(quantityPrefix, val);
                  setQuantities((prev) => ({ ...prev, base: val }));
                }}
              />
            )}
          </Field>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Field name={pricePrefix}>
            {({ field }) => (
              <TextField
                {...field}
                label="Price"
                type="text"
                fullWidth
                value={formatWithCommas(values[pricePrefix] || "")}
                helperText={touched[pricePrefix] && errors[pricePrefix]}
                error={Boolean(touched[pricePrefix] && errors[pricePrefix])}
                onChange={(e) => {
                  const raw = removeCommas(e.target.value);
                  const val = raw === "" ? 0 : parseFloat(raw);
                  setFieldValue(pricePrefix, val);
                  setPrices((prev) => ({ ...prev, base: val }));
                }}
              />
            )}
          </Field>
        </Grid>

        <Grid item xs={12} sm={2}>
          {rows.length === 0 && (
            <IconButton onClick={handleAddRow} color="success">
              <AddCircle />
            </IconButton>
          )}
        </Grid>
      </Grid>

      {/* Dynamic Rows */}
      {rows.map((row) => {
        const suffix = row.id;
        const nameKey = `${namePrefix}${suffix}`;
        const quantityKey = `${quantityPrefix}${suffix}`;
        const priceKey = `${pricePrefix}${suffix}`;

        return (
          <Grid
            container
            spacing={2}
            alignItems="center"
            key={suffix}
            sx={{ mb: 2 }}
          >
            <Grid item xs={12} sm={4}>
              <Field name={nameKey}>
                {({ field, form }) => (
                  <Select
                    options={options}
                    name={nameKey}
                    value={
                      options.find((opt) => opt.value === field.value) || null
                    }
                    onChange={(option) =>
                      form.setFieldValue(nameKey, option?.value || "")
                    }
                    placeholder="Select Option"
                    isClearable
                  />
                )}
              </Field>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Field name={quantityKey}>
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Quantity"
                    type="number"
                    fullWidth
                    helperText={touched[quantityKey] && errors[quantityKey]}
                    error={Boolean(touched[quantityKey] && errors[quantityKey])}
                    onChange={(e) => {
                      const val =
                        e.target.value === ""
                          ? 0
                          : parseInt(e.target.value, 10);
                      setFieldValue(quantityKey, val);
                      setQuantities((prev) => ({ ...prev, [suffix]: val }));
                    }}
                  />
                )}
              </Field>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Field name={priceKey}>
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Price"
                    type="text"
                    fullWidth
                    value={formatWithCommas(values[priceKey] || "")}
                    helperText={touched[priceKey] && errors[priceKey]}
                    error={Boolean(touched[priceKey] && errors[priceKey])}
                    onChange={(e) => {
                      const raw = removeCommas(e.target.value);
                      const val = raw === "" ? 0 : parseFloat(raw);
                      setFieldValue(priceKey, val);
                      setPrices((prev) => ({ ...prev, [suffix]: val }));
                    }}
                  />
                )}
              </Field>
            </Grid>

            <Grid item xs={12} sm={2}>
              <IconButton onClick={() => handleRemoveRow(suffix)} color="error">
                <RemoveCircle />
              </IconButton>
              {rows.length < MAX_DYNAMIC_ROWS &&
                row.id === rows[rows.length - 1].id && (
                  <IconButton onClick={handleAddRow} color="success">
                    <AddCircle />
                  </IconButton>
                )}
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};

export default DynamicFields;
