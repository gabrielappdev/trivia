import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { getEndpoint, getRoute } from "@constants/index";
import Link from "next/link";
import { LocalStorage } from "@services/localStorage";
import { user as userAtom } from "@atoms/user";
import axiosClient from "@services/api";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import SignTemplate from "@layouts/sign";

type SignUpDefaultValuesProps = {
  email: string;
  password: string;
  confirmPassword: string;
};

const localStorage = new LocalStorage();

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDefaultValuesProps>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const toast = useToast();

  const router = useRouter();

  const [user, setUser] = useRecoilState(userAtom);
  const [isLoading, setIsLoading] = useState(false);

  const [visiblePasswordsState, setVisiblePasswordsState] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const token = localStorage.getData("_trivia")?.user?.jwt;
    if (!!token) {
      localStorage.removeData("_trivia");
    }
  }, [user]);

  const togglePasswordVisibility = (type: "password" | "confirmPassword") => {
    setVisiblePasswordsState({
      ...visiblePasswordsState,
      [type]: !visiblePasswordsState[type],
    });
  };

  const persistUser = (userObject) => {
    setUser(userObject);
    localStorage.setData("_trivia", { user: userObject });
  };

  const onSubmit = async (submitData: SignUpDefaultValuesProps) => {
    const { password, confirmPassword } = submitData;
    if (password !== confirmPassword) {
      return toast({
        title: "Error",
        description: "Please, check your passwords.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(true);
    try {
      const data = { ...submitData };
      delete data.confirmPassword;
      const {
        data: { jwt, user },
      } = await axiosClient.post(getEndpoint("signup"), data);
      const storedUser = { ...user, jwt };

      persistUser(storedUser);

      toast({
        title: `Welcome ${user.email}`,
        description: "Enjoy our platform!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Error found!",
        description: error?.response?.data?.error?.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignTemplate>
      <Box w="100%" bg="white" shadow="md" p={4} borderRadius={4}>
        <VStack w="inherit" alignItems="flex-start" spacing={2}>
          <Heading mb="2" size="md">
            Sign up
          </Heading>
          <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("email", { required: true })}
              placeholder="E-mail"
              type="email"
              mb={4}
            />
            <InputGroup>
              <Input
                {...register("password", { required: true })}
                isInvalid={!!errors?.password}
                placeholder="Password"
                type={visiblePasswordsState["password"] ? "text" : "password"}
                mb={4}
              />
              <InputRightAddon>
                <IconButton
                  onClick={() => togglePasswordVisibility("password")}
                  aria-label="Display password"
                  icon={
                    visiblePasswordsState["password"] ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )
                  }
                />
              </InputRightAddon>
            </InputGroup>
            <InputGroup>
              <Input
                {...register("confirmPassword", { required: true })}
                isInvalid={!!errors?.confirmPassword}
                placeholder="Password confirmation"
                type={
                  visiblePasswordsState["confirmPassword"] ? "text" : "password"
                }
                mb={4}
              />
              <InputRightAddon>
                <IconButton
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  aria-label="Display password"
                  icon={
                    visiblePasswordsState["confirmPassword"] ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )
                  }
                />
              </InputRightAddon>
            </InputGroup>
            <Flex align="center" w="100%">
              <Button isLoading={isLoading} colorScheme="green" type="submit">
                Register
              </Button>
              <Button
                isDisabled={isLoading}
                colorScheme="gray"
                ml={4}
                type="reset"
              >
                Reset
              </Button>
            </Flex>
            <Divider my={4} />
            <VStack w="100%" justify="flex-end">
              <Text fontSize="md">Do you already have an account ?</Text>
              <Link href={getRoute("signin")}>
                <Button colorScheme="blue">Sign in</Button>
              </Link>
            </VStack>
          </form>
        </VStack>
      </Box>
    </SignTemplate>
  );
};

export default SignUp;
