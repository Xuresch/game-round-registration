import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

import Card from "@/components/shared/card";

const SwaggerUI = dynamic(
  import('swagger-ui-react').then((mod) => mod.default),
  { ssr: false }
);

export default function ApiDocs() {
  return (
    <Card>
      <SwaggerUI url="apidoc/swagger.json" />
    </Card>
  );
}
