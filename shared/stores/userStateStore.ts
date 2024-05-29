import { create } from "zustand";
import type { FileUrl } from "~shared/types/blackboardTypes";

export type AlignWith = "date" | "subject";

interface StoreState {
    alignWith: AlignWith;
    checkedFiles: FileUrl[];
}

interface StoreActions {
    setAlignWith: (alignWith: AlignWith) => void;
    setCheckedFiles: (checkedFiles: FileUrl[]) => void;
    addCheckedFile: (file: FileUrl) => void;
    removeCheckedFile: (file: FileUrl) => void; // Corrected method name here
}

type UseStore = StoreState & StoreActions;

const store = (set, get) => ({
    alignWith: "date" as AlignWith,  // Ensuring the initial value matches the specified type
    checkedFiles: [],
    setAlignWith: (alignWith: AlignWith) => set({ alignWith }),
    setCheckedFiles: (checkedFiles: FileUrl[]) => set({ checkedFiles }),
    addCheckedFile: (file: FileUrl) => {
        const checkedFiles = get().checkedFiles;
        if (!checkedFiles.find(f => f.fileURL === file.fileURL)) {
            set((state: UseStore) => ({ checkedFiles: [...state.checkedFiles, file] }));
        }
    },
    removeCheckedFile: (file: FileUrl) => {
        set((state: UseStore) => ({ checkedFiles: state.checkedFiles.filter(f => f.fileURL !== file.fileURL) }));
    },
});
const useUserStateStore = create<UseStore>(store);
export const { setAlignWith, setCheckedFiles, addCheckedFile, removeCheckedFile } = useUserStateStore.getState();
export default useUserStateStore;