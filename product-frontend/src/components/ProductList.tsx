import { useEffect, useState } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails,
  Typography, IconButton, Stack, Divider, Box,
  Snackbar, Alert, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from "../api/axios";
import type { Product } from "../types/Product";

interface Props {
  onEdit: (product: Product) => void;
  refresh: boolean;
}

export default function ProductList({ onEdit, refresh }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
    open: boolean;
  }>({ message: "", type: "success", open: false });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setError("");
      const response = await api.get("/products");
      const sorted = response.data.sort((a: Product, b: Product) =>
        a.name.localeCompare(b.name, "pt-BR")
      );
      setProducts(sorted);
    } catch {
      setError("Erro ao carregar os produtos. Tente novamente.");
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      let name = productToDelete?.name
      await api.delete(`/products/${productToDelete.id}`);
      setFeedback({
        message: `Produto ${name} excluído com sucesso.`,
        type: "success",
        open: true,
      });
      fetchProducts();
    } catch {
      setFeedback({
        message: "Erro ao excluir o produto.",
        type: "error",
        open: true,
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  const handleCloseSnackbar = () => {
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Stack spacing={2}>
        {error && (
          <Typography color="error" variant="body2" textAlign="center">
            {error}
          </Typography>
        )}

        {!error && products.length === 0 && (
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.disabled">
              Adicione produtos para visualizar aqui.
            </Typography>
          </Box>
        )}

        {products.map((product) => (
          <Accordion key={product.id} disableGutters elevation={1} sx={{ borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {product.name}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton color="primary" onClick={() => onEdit(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setProductToDelete(product);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>
            </AccordionSummary>
            <Divider />
            <AccordionDetails sx={{ backgroundColor: "#f9f9f9" }}>
              <Typography>Preço: R$ {product.price.toFixed(2)}</Typography>
              <Typography>SKU: {product.sku}</Typography>
              <Typography>Letra ausente: {product.missingLetter}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={feedback.type}
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o produto{" "}
            <strong>{productToDelete?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
