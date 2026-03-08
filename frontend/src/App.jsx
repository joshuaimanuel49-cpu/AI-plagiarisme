import ImageCompare from "./pages/ImageCompare";

export default function App() {
  return (
    <>
      {/* === PARTICLE BACKGROUND === */}
      <div class="particle-bg"></div>
      <div class="particle-bg purple"></div>

      {/* === FLOATING BLOBS === */}
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>

      {/* === MAIN CONTENT === */}
      <ImageCompare />
    </>
  );
}


