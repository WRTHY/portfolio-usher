import RunButton from '../atoms/RunButton'

type PanelFooterProps = {
  filePath: string
}

function PanelFooter({ filePath }: PanelFooterProps) {
  return (
    <div className="panel-footer">
      <span className="panel-footer-path">{filePath}</span>
      <div className="panel-footer-actions">
        <span className="live-demo-pill">Live demo — coming soon</span>
        <RunButton />
      </div>
    </div>
  )
}

export default PanelFooter
