import { Button, Card } from "@/shared/ui";

export function ReprocessCard({ busy, onReprocess }: { busy: boolean; onReprocess: () => void }) {
  return (
    <>
      <h2>Si algo no cuadra</h2>
      <Card>
        <div className="row">
          <div className="grow">
            <div>Reprocesar desde los bancos</div>
            <div className="sub">Recalcula categorías y transferencias; no cambia lo que has tocado a mano</div>
          </div>
          <Button disabled={busy} onClick={onReprocess}>
            {busy ? "…" : "Hazlo ahora"}
          </Button>
        </div>
      </Card>
    </>
  );
}
