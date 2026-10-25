import { Button, Card } from "@/shared/ui";

export function ReprocessCard({ busy, onReprocess }: { busy: boolean; onReprocess: () => void }) {
  return (
    <>
      <h2>si algo no cuadra</h2>
      <Card>
        <div className="row">
          <div className="grow">
            <div>reprocesar desde los bancos</div>
            <div className="sub">recalcula categorías y transferencias; no cambia lo que has tocado a mano</div>
          </div>
          <Button disabled={busy} onClick={onReprocess}>
            {busy ? "…" : "hazlo ahora"}
          </Button>
        </div>
      </Card>
    </>
  );
}
