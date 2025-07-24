import { Container, Button, Box } from "@mui/material";
import { useState } from "react";
import ProductList from "./components/ProductList";
import ProductDialog from "./components/ProductDialog";
import Navbar from "./components/Navbar";
import type { Product } from "./types/Product";

function App() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleCreate = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRefreshList(!refreshList);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" onClick={handleCreate}>
            Criar Produto
          </Button>
        </Box>
        <ProductList onEdit={handleEdit} refresh={refreshList} />
        <ProductDialog
          open={openDialog}
          onClose={handleCloseDialog}
          product={selectedProduct}
        />
      </Container>
    </>
  );
}

export default App;
