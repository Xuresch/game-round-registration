import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(
  import('swagger-ui-react').then((mod) => mod.default),
  { ssr: false }
);

export default function ApiDocs() {
  return (
    <div>
      <SwaggerUI url="apidoc/swagger.json" />
    </div>
  );
}
