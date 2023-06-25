const path=require('path')
const voucherModel = require(path.join(__dirname,'..','models','voucher.model'))
// const voucherModel = require('../models/voucher.model')

class voucherController{

    index(req, res){
        try{
            voucherModel.find()
            .then((vouchers)=>{
                res.json({success: true, message: "all vouchers data are retrieved", data: vouchers})
            })
            .catch((error)=>res.status(500).json({success: false , message: error.message}))

        }catch(error){res.status(500).json({success: false, message: error.message})}
    }

    create (req,res){
        try{
            // variable to create voucher random string -- create expire date
            voucherModel.create(req.body)
            .then((createdvoucher)=>res.json({success: true, message: "voucher is created Successfully", data: createdvoucher}))
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }
    }

    show (req, res){
        try{
            const id = req.params.id
            voucherModel.findOne({_id: id})
            .then((voucher)=>{
                if(voucher){
                    res.json({success: true, message: "Getting voucher data succefully", "data": voucher})
                }
                else res.status(404).json({success:false, message: "voucher doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))

        }catch(error){res.status(500).json({success:false, message: error.message})}
    }

    update (req,res){
        try {
            const id = req.params.id
            voucherModel.findByIdAndUpdate({_id: id}, {$set: req.body}, {new: true})
            .then((updatedvoucher)=>{
                if(updatedvoucher) res.json({success:true, data: updatedvoucher, message: "voucher has been Updated successfully"})
                else res.status(404).json({success:false, message:"voucher doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        } catch (error) {
            res.status(500).json({success:false, message: error.message})
        }
    }
    softDelete(req, res) {
        try {
          const id = req.params.id;
          voucherModel
            .findOneAndUpdate(
              { _id: id },
              { $set: { isDeleted: true } },
              { new: true }
            )
            .then((deletedvoucher) => {
              res.json({
                success: true,
                data: deletedvoucher,
                message: "Voucher has been deleted successfully",
              });
            })
            .catch((error) =>
              res.status(500).json({ success: false, message: error.errors })
            );
        } catch (error) {
          res.status(500).json({ success: false, message: error.errors });
        }
      }

    delete (req,res){
        try{
            const id = req.params.id
            voucherModel.findByIdAndDelete(id)
            .then((deletedvoucher)=>{
                if(deletedvoucher) res.json({success:true, data: deletedvoucher, message: "voucher has been deleted successfully"})
                else res.status(404).json({success:false, message:"voucher doesn't exist"})
            })
            .catch((error)=>res.status(500).json({success:false, message: error.message}))
        }
        catch(error){
            res.status(500).json({success:false, message: error.message})
        }

    }

}

module.exports = new voucherController()
