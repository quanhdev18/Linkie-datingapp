from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.schemas.package import PackageCreate, PackageOut, PurchaseCreate
from app.crud.package import create_package, create_purchase, get_all_packages, update_purchase_status
from app.core.database import get_db
import uuid
from app.core.momo import create_momo_url

router = APIRouter()

@router.get("/packages", response_model=list[PackageOut])
def list_packages(db: Session = Depends(get_db)):
    return get_all_packages(db)

@router.post("/packages", response_model=PackageOut)
def add_package(data: PackageCreate, db: Session = Depends(get_db)):
    return create_package(db, data)

@router.post("/purchase", response_model=dict)
def start_purchase(data: PurchaseCreate, user_id: int, request: Request, db: Session = Depends(get_db)):
    txn_ref = str(uuid.uuid4())
    package = db.query(Package).filter(Package.id == data.package_id).first()
    if not package:
        return {"error": "Package not found"}
    
    purchase = create_purchase(db, user_id, data.package_id, txn_ref)
    payment_url = create_momo_url(request, int(package.price), txn_ref)
    return {"payment_url": payment_url}

@router.get("/payment/momo-callback")
def momo_callback(orderId: str, resultCode: str, db: Session = Depends(get_db)):
    status = "success" if resultCode == "0" else "failed"
    update_purchase_status(db, orderId, status, vnp_transaction_no="momo-"+orderId)
    return {"message": "MoMo payment processed", "status": status}
