from src.auth import get_client


def main():
    sp = get_client()
    user = sp.current_user()
    print(f"Connected as: {user['display_name']}")


if __name__ == "__main__":
    main()
