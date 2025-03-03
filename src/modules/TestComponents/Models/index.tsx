import { useGetModels } from "./api/getModels";

export default function Models() {
  const { data } = useGetModels({});

  console.log({ data });

  return (
    <>
      <h2>Models</h2>
      <p>https://dev-super-gamma.globalmagick.com/models</p>

      {data?.models.map((model) => (
        <p key={model.model_id}>{model.model_name}</p>
      ))}
    </>
  );
}
