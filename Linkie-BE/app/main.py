# # app/main.py
# from fastapi import FastAPI
# from fastapi.openapi.utils import get_openapi
# from app.core.database import engine, Base
# # from app.routers import ProfileController, ImageController, AuthController, AccountController, location
# from fastapi.staticfiles import StaticFiles
# from app.routers import ProfileController, ImageController, AuthController, AccountController, LocationController, MessageController, NotificationController, InteractionController, package, location, ChattingController

# Base.metadata.create_all(bind=engine)

# app = FastAPI()
# app.include_router(AuthController.router)
# app.include_router(AccountController.router)
# app.include_router(ProfileController.router)
# app.include_router(ImageController.router)
# app.include_router(LocationController.router)
# app.include_router(MessageController.router)
# app.include_router(NotificationController.router)
# app.include_router(InteractionController.router)
# app.include_router(ChattingController.router)
# app.include_router(package.router)
# app.mount("/static", StaticFiles(directory="static"), name="static")

# @app.get("/")
# def root():
#     return {"message": "Dating app API is live"}

# def custom_openapi():
#     if app.openapi_schema:
#         return app.openapi_schema
#     openapi_schema = get_openapi(
#         title="Linkie API",
#         version="1.0.0",
#         description="Linkie API with JWT Authentication",
#         routes=app.routes,
#     )
#     openapi_schema["components"]["securitySchemes"] = {
#         "BearerAuth": {
#             "type": "http",
#             "scheme": "bearer",
#             "bearerFormat": "JWT"
#         }
#     }
#     for path in openapi_schema["paths"].values():
#         for operation in path.values():
#             operation.setdefault("security", []).append({"BearerAuth": []})
#     app.openapi_schema = openapi_schema
#     return app.openapi_schema

# app.openapi = custom_openapi

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware  # ✅ Thêm dòng này

from app.core.database import engine, Base
from fastapi.staticfiles import StaticFiles
from app.routers import (
    ProfileController, ImageController, AuthController,
    AccountController, LocationController, MessageController,
    NotificationController, InteractionController,
    package, location, ChattingController, report
)

Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ Bổ sung cấu hình CORS ở đây:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # chỉnh sửa nếu frontend dùng port khác
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tiếp tục include router như cũ
app.include_router(AuthController.router)
app.include_router(AccountController.router)
app.include_router(ProfileController.router)
app.include_router(ImageController.router)
app.include_router(LocationController.router)
app.include_router(MessageController.router)
app.include_router(NotificationController.router)
app.include_router(InteractionController.router)
app.include_router(ChattingController.router)
app.include_router(package.router)
app.include_router(report.router)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    return {"message": "Dating app API is live"}

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Linkie API",
        version="1.0.0",
        description="Linkie API with JWT Authentication",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"].values():
        for operation in path.values():
            operation.setdefault("security", []).append({"BearerAuth": []})
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
