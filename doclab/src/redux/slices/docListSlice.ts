import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Document from '@/models/documentModel';

interface DocumentsState {
  documents: Document[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentsState = {
  documents: [],
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    fetchDocumentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDocumentsSuccess(state, action: PayloadAction<Document[]>) {
      state.loading = false;
      state.documents = action.payload;
    },
    fetchDocumentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Add reducers for other CRUD operations
  },
});

export const {
  fetchDocumentsStart,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
} = documentSlice.actions;

export default documentSlice.reducer;
