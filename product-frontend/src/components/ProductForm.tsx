import { useState } from "react";
import { TextField, Button, Box, Paper } from "@mui/material";
import api from "../api/axios";
import type { Product } from "../types/Product";

interface Props {
  onProductCreated: (product: Product) => void;
}

export default function ProductForm({ onProductCreated }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("products", {
        name,
        price: parseFloat(price),
        sku,
      });
      console.log(response.data)
      setName("");
      setPrice("");
      setSku("");
      onProductCreated(response.data);
    } catch (err) {
      alert("Erro ao criar produto");
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
      <form onSubmit={handleSubmit}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Preço"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            fullWidth
            required
          />
          <Button variant="contained" type="submit" sx={{ minWidth: "200px" }}>
            Adicionar Produto
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
