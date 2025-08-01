import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, TextField, Button
} from "@mui/material";
import api from "../api/axios";
import type { Product } from "../types/Product";

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export default function ProductDialog({ open, onClose, product }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString().replace('.', ','));
      setSku(product.sku);
    } else {
      setName("");
      setPrice("");
      setSku("");
    }
  }, [product]);

  const handleSubmit = async () => {
    try {
      const parsedPrice = parseFloat(price.replace(",", "."));
      if (isNaN(parsedPrice)) {
        throw new Error("Preço inválido.");
      }

      if (product) {
        await api.put(`/products/${product.id}`, {
          name,
          price: parsedPrice,
          sku,
        });
      } else {
        await api.post("/products", {
          name,
          price: parsedPrice,
          sku,
        });
      }
      onClose();
    } catch (error) {
      setErrorMessage("Já existe um produto com esse mesmo SKU.");
      setErrorDialogOpen(true);
    }
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{product ? "Editar Produto" : "Criar Produto"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Preço"
            type="text"
            value={price}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
                setPrice(value);
              }
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {product ? "Salvar" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={errorDialogOpen} onClose={handleCloseErrorDialog}>
        <DialogTitle>Erro</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
