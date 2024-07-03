import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { RegisterType } from "../components/register/Register.props";
import { dataValues } from "../components/vega/data/flare";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public",
  "Content-Type": "application/json",
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIwODczODM5LCJpYXQiOjE3MjAwMDk4MzksImp0aSI6IjhmZWUxMWU2NzU0NDRlYWZhNGRiNWI4OTczYzc0YjI5IiwidXNlcl9pZCI6MTF9.5Tld7ZfYDxbqXO-E6Xn2N4OIgUsZbHnGXfpD7kv1oUM",
};

export const useListUpdate = () => {
  return useMutation(async ({ logo, name, description }: RegisterType) => {
    const res = await axios({
      method: "post",
      data: {
        logo,
        name,
        description,
        categories: [2],
        seller_type: 2,
      },
      url: `http://ef666f36-0e89-4d95-9dbc-006d1b95b64a.hsvc.ir:30051/api/v1/sellers/`,
      headers,
    });
    return res.data;
  });
};

export const useList = ({ refresh }: { refresh: Date }) => {
  async function f() {
    const { data } = await axios({
      url: `http://ef666f36-0e89-4d95-9dbc-006d1b95b64a.hsvc.ir:30051/api/v1/users/sellers/`,
      headers,
    });
    // return data?.map((i: RegisterType, index: number) => {
    // return {
    //   id: index,
    //   name: i.name,
    //   // size: Math.round(Math.random() * 1000),
    //   image: i.logo_path,
    //   parent: data
    //     .map((j: RegisterType, n: number) => n)
    //     .filter((j: number) => j !== index)[
    //     Math.round(Math.random() * (data?.length - 1))
    //   ],
    // };
    // });
    return dataValues
      .map((i, index) => {
        return { ...i, name: data[index]?.name || "name" };
      })
      .slice(0, data.length);
  }
  return useQuery([`users/sellers`, refresh], f, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    retryDelay: 3000,
  });
};
