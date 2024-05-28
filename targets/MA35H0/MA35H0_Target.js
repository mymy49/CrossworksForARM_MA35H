/*****************************************************************************
 * Copyright (c) 2023 Rowley Associates Limited.                             *
 *                                                                           *
 * This file may be distributed under the terms of the License Agreement     *
 * provided with this software.                                              *
 *                                                                           *
 * THIS FILE IS PROVIDED AS IS WITH NO WARRANTY OF ANY KIND, INCLUDING THE   *
 * WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. *
 *                                                                           *
 *****************************************************************************/

load("targets/Sitara/ICEPick.js")

function ResetTAP()
{  
	// TAP Reset - TI's OMAP-3 requires 100 TCKs to get JTAG power domain working. 
	TargetInterface.setTMS(1);
	TargetInterface.cycleTCK(1000);
	TargetInterface.setTMS(0); 
	TargetInterface.cycleTCK(1);

	ICEPickStart();   
	//ICEPickAddTAP(11);  // CM3
	ICEPickAddTAPAndCore(12, 0);  // CA8
	ICEPickFinish();
}

function Connect()
{
	if (TargetInterface.implementation() == "j-link")
		TargetInterface.setDebugInterfaceProperty("set_adiv5_APB_ap_num", 1);
	else
	{
		TargetInterface.selectDevice(0, 0, 0, 0);
		ResetTAP();  
		TargetInterface.selectDevice(0, 6, 0, 1);
		// DP locks up when accessing non-existent AP's
		TargetInterface.setDebugInterfaceProperty("max_ap_num", 3);
	}
}

function Reset()
{
  if (TargetInterface.implementation() == "j-link")
    TargetInterface.resetAndStop(1000);
  else
    {

    }d
}

function GetPartName()
{
	return "MA35H0";
}

function MatchPartName(name)
{
  var partName = GetPartName();

  if (partName == "")
    return false;

  return name.indexOf(partName) == 0;
}

